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
    if (count < 1000) {
        return 0;
    }
    if (count < 3000) {
        return 1;
    }
    if (count < 7000) {
        return 2;
    }
    if (count < 15000) {
        return 3;
    }
    if (count < 31000) {
        return 4;
    }
    if (count < 63000) {
        return 5;
    }
    if (count < 127000) {
        return 6;
    }
    if (count < 255000) {
        return 7;
    }
    return 8; // Mature Era
}

fun calculateSeedBasis(generation: int): coins {
    if (generation == 0) {
        return 5000000000000;
    }         // 5,000 * 10^9
    if (generation == 1) {
        return 2500000000000;
    }         // 2,500 * 10^9
    if (generation == 2) {
        return 1250000000000;
    }         // 1,250 * 10^9
    if (generation == 3) {
        return 625000000000;
    }         // 625 * 10^9
    if (generation == 4) {
        return 312500000000;
    }         // 312.5 * 10^9
    if (generation == 5) {
        return 156250000000;
    }         // 156.25 * 10^9
    if (generation == 6) {
        return 78125000000;
    }         // 78.125 * 10^9
    if (generation == 7) {
        return 39062500000;
    }         // 39.0625 * 10^9
    return 0; // Mature Era (>= 8): no seed entitlement
}

fun calculateGrowthVaultCap(generation: int): coins {
    if (generation == 0) {
        return 75000000000000;
    }         // 75,000 * 10^9
    if (generation == 1) {
        return 37500000000000;
    }         // 37,500 * 10^9
    if (generation == 2) {
        return 18750000000000;
    }         // 18,750 * 10^9
    if (generation == 3) {
        return 9375000000000;
    }         // 9,375 * 10^9
    if (generation == 4) {
        return 4687500000000;
    }         // 4,687.5 * 10^9
    if (generation == 5) {
        return 2343750000000;
    }         // 2,343.75 * 10^9
    if (generation == 6) {
        return 1171875000000;
    }         // 1,171.875 * 10^9
    if (generation == 7) {
        return 585937500000;
    }         // 585.9375 * 10^9
    return 0; // Mature Era (>= 8): no growth vault entitlement
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
            assert (storage.registeredAgentsCount < 255000) throw Errors.MatureEraNoSubsidy;

            // Nonce replay check
            assert (!storage.usedNonces.get(msg.nonce).isFound) throw Errors.ReplayNonce;

            // Expiry check
            assert (blockchain.now() <= msg.expiry) throw Errors.ExpiredAttestation;

            // Duplicate Agent ID check
            assert (!storage.agents.get(msg.agentId).isFound) throw Errors.DuplicateAgent;

            // One Eligible Owner = One Primary AI check
            assert (!storage.ownerAgents.get(msg.ownerAddress).isFound) throw Errors.DuplicateOwner;

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

            val assignedIndex = storage.registeredAgentsCount;
            val assignedGen = getGenerationFromCount(assignedIndex);
            val seedBasis = calculateSeedBasis(assignedGen);
            val growthCap = calculateGrowthVaultCap(assignedGen);

            val record: AgentRecord = {
                agentId: msg.agentId,
                ownerAddress: msg.ownerAddress,
                generation: assignedGen,
                registeredIndex: assignedIndex,
                registeredAt: blockchain.now(),
                initialSeedBasis: seedBasis,
                growthVaultCap: growthCap,
                claimedStagesMask: 0,
            };

            storage.usedNonces.set(msg.nonce, true);
            storage.agents.set(msg.agentId, record);
            storage.ownerAgents.set(msg.ownerAddress, msg.agentId);
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

            // Agent existence check and bitmap check for duplicate stage claim
            val agentLookup = storage.agents.get(msg.agentId);
            val stageBit: uint32 = 1 << msg.stage;
            if (agentLookup.isFound) {
                var agentRec = agentLookup.loadValue();
                assert (
                    (agentRec.claimedStagesMask & stageBit) == 0
                ) throw Errors.StageAlreadyClaimed;
                agentRec.claimedStagesMask = agentRec.claimedStagesMask | stageBit;
                storage.agents.set(msg.agentId, agentRec);
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

            // Update nonce state
            storage.usedNonces.set(msg.nonce, true);
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
    val lookupRes = storage.agents.get(agentId);
    if (!lookupRes.isFound) {
        return false;
    }
    val agentRec = lookupRes.loadValue();
    val stageBit: uint32 = 1 << stage;
    return (agentRec.claimedStagesMask & stageBit) != 0;
}

get fun get_agent_record(agentId: uint256): AgentRecord? {
    val storage = lazy EmissionStorage.load();
    val lookupRes = storage.agents.get(agentId);
    if (!lookupRes.isFound) {
        return null;
    }
    return lookupRes.loadValue();
}

get fun get_agent_by_owner(ownerAddr: address): uint256? {
    val storage = lazy EmissionStorage.load();
    val lookupRes = storage.ownerAgents.get(ownerAddr);
    if (!lookupRes.isFound) {
        return null;
    }
    return lookupRes.loadValue();
}

get fun get_generation_entitlement(generation: int): (coins, coins) {
    return (calculateSeedBasis(generation), calculateGrowthVaultCap(generation));
}
