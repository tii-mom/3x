import "@contracts/common/economic-buckets"
import "@contracts/common/errors"
import "@contracts/common/messages"
import "@contracts/common/signature-domain"
import "@contracts/common/storage"

type AllowedMessageToEmission =
    | RegisterPrimaryAi
    | ClaimGrowthStage
    | PauseEmissionController
    | UnpauseEmissionController
    | SetOraclePublicKey

fun getGenerationFromCount(count: int): int {
    if (count <= 1000) {
        return 0;
    }
    if (count <= 3000) {
        return 1;
    }
    if (count <= 7000) {
        return 2;
    }
    if (count <= 15000) {
        return 3;
    }
    if (count <= 31000) {
        return 4;
    }
    if (count <= 63000) {
        return 5;
    }
    if (count <= 127000) {
        return 6;
    }
    if (count <= 255000) {
        return 7;
    }
    return 8; // Mature Era
}

fun calculateGrowthSubsidy(stage: int): coins {
    if (stage == 1) {
        return 100000000000;
    } // 100 * 10^9
    if (stage == 2) {
        return 200000000000;
    } // 200 * 10^9
    if (stage == 3) {
        return 300000000000;
    } // 300 * 10^9
    if (stage == 4) {
        return 500000000000;
    } // 500 * 10^9
    if (stage == 5) {
        return 1000000000000;
    } // 1000 * 10^9
    return 0;
}

fun onInternalMessage(in: InMessage) {
    if (in.body.isEmpty()) {
        return;
    }

    val msg = lazy AllowedMessageToEmission.fromSlice(in.body);

    match (msg) {
        PauseEmissionController => {
            var storage = lazy EmissionStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.isPaused = true;
            storage.save();
        }

        UnpauseEmissionController => {
            var storage = lazy EmissionStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.isPaused = false;
            storage.save();
        }

        SetOraclePublicKey => {
            var storage = lazy EmissionStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.oraclePublicKey = msg.newPublicKey;
            storage.save();
        }

        RegisterPrimaryAi => {
            var storage = lazy EmissionStorage.load();
            assert (!storage.isPaused) throw Errors.ControllerPaused;
            assert (storage.registeredAgentsCount + 1 <= 255000) throw Errors.MatureEraNoSubsidy;

            // Nonce replay check
            assert (!storage.usedNonces.get(msg.nonce).isFound) throw Errors.ReplayNonce;

            // Expiry check
            assert (blockchain.now() <= msg.expiry) throw Errors.ExpiredAttestation;

            // Signature verification with domain separation
            val regHash = buildRegistrationHash(
                storage.networkId,
                contract.getAddress(),
                msg.agentId,
                msg.ownerAddress,
                msg.nonce,
                msg.expiry,
                msg.paramVersion,
            );
            val regSigSlice = msg.signature.beginParse();
            assert (
                isSignatureValid(regHash, regSigSlice, storage.oraclePublicKey)
            ) throw Errors.InvalidSignature;

            storage.usedNonces.set(msg.nonce, true);
            storage.registeredAgentsCount += 1;
            storage.save();
        }

        ClaimGrowthStage => {
            var storage = lazy EmissionStorage.load();
            assert (!storage.isPaused) throw Errors.ControllerPaused;
            assert (msg.stage >= 1 && msg.stage <= 5) throw Errors.InvalidStage;

            // Nonce replay check
            assert (!storage.usedNonces.get(msg.nonce).isFound) throw Errors.ReplayNonce;

            // Expiry check
            assert (blockchain.now() <= msg.expiry) throw Errors.ExpiredAttestation;

            // Bitmap check for duplicate stage claim
            val lookupRes = storage.claimedStages.get(msg.agentId);
            val stageBit: uint32 = 1 << msg.stage;
            if (lookupRes.isFound) {
                val currentMask = lookupRes.loadValue();
                assert ((currentMask & stageBit) == 0) throw Errors.StageAlreadyClaimed;
            }

            // Signature verification with domain separation
            val claimHash = buildGrowthClaimHash(
                storage.networkId,
                contract.getAddress(),
                msg.agentId,
                msg.ownerAddress,
                msg.stage,
                msg.nonce,
                msg.expiry,
                msg.paramVersion,
            );
            val claimSigSlice = msg.signature.beginParse();
            assert (
                isSignatureValid(claimHash, claimSigSlice, storage.oraclePublicKey)
            ) throw Errors.InvalidSignature;

            val subsidyAmount = calculateGrowthSubsidy(msg.stage);
            assert (subsidyAmount > 0) throw Errors.InvalidStage;

            // Update state
            storage.usedNonces.set(msg.nonce, true);
            val oldMask: uint32 = lookupRes.isFound ? lookupRes.loadValue() : 0;
            val updatedMask: uint32 = oldMask | stageBit;
            storage.claimedStages.set(msg.agentId, updatedMask);
            storage.save();

            // Forward release request to AIReserveVault (Bucket 1: Growth)
            val releaseMsg = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: storage.reserveVault,
                value: 0,
                body: ReleaseReserveToAgent {
                    queryId: msg.queryId,
                    agentId: msg.agentId,
                    recipient: msg.ownerAddress,
                    amount: subsidyAmount,
                    stage: msg.stage,
                    bucketId: BUCKET_GROWTH, // Growth
                },
            });
            releaseMsg.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }

        else => throw Errors.InvalidOp,
    }
}

struct EmissionInfoReply {
    totalRegistered: uint32
    currentGeneration: uint8
    isPaused: bool
    owner: address
    reserveVault: address
}

get fun get_generation_info(): EmissionInfoReply {
    val storage = lazy EmissionStorage.load();
    val gen = getGenerationFromCount(storage.registeredAgentsCount);
    return {
        totalRegistered: storage.registeredAgentsCount,
        currentGeneration: gen,
        isPaused: storage.isPaused,
        owner: storage.owner,
        reserveVault: storage.reserveVault,
    };
}

get fun is_stage_claimed(agentId: uint256, stage: int): bool {
    val storage = lazy EmissionStorage.load();
    val lookupRes = storage.claimedStages.get(agentId);
    if (!lookupRes.isFound) {
        return false;
    }
    val mask = lookupRes.loadValue();
    val stageBit: uint32 = 1 << stage;
    return (mask & stageBit) != 0;
}
