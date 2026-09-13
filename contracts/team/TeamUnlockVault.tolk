import "@contracts/common/errors"
import "@contracts/common/messages"
import "@contracts/common/signature-domain"
import "@contracts/common/storage"

type AllowedMessageToTeam =
    | AttestTeamRound
    | ClaimTeamTokens
    | SetTeamVaultJettonWallet
    | PauseTeamVault
    | UnpauseTeamVault

fun onInternalMessage(in: InMessage) {
    if (in.body.isEmpty()) {
        return;
    }

    val msg = lazy AllowedMessageToTeam.fromSlice(in.body);

    match (msg) {
        PauseTeamVault => {
            var storage = lazy TeamVaultStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.isPaused = true;
            storage.save();
        }

        UnpauseTeamVault => {
            var storage = lazy TeamVaultStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.isPaused = false;
            storage.save();
        }

        SetTeamVaultJettonWallet => {
            var storage = lazy TeamVaultStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            var config = storage.config.load();
            config.jettonWallet = msg.jettonWallet;
            storage.config = config.toCell();
            storage.save();
        }

        AttestTeamRound => {
            var storage = lazy TeamVaultStorage.load();
            assert (!storage.isPaused) throw Errors.ControllerPaused;
            assert (msg.round >= 1 && msg.round <= 10) throw Errors.InvalidStage;
            assert (
                !storage.unlockedRounds.get(msg.round).isFound
            ) throw Errors.RoundAlreadyUnlocked;
            assert (!storage.usedNonces.get(msg.nonce).isFound) throw Errors.ReplayNonce;
            assert (blockchain.now() <= msg.expiry) throw Errors.ExpiredAttestation;

            // Network KPI gates
            assert (msg.activeAgents >= msg.round * 1000) throw Errors.KpiNotMet;
            assert (
                msg.externalRevenueUsd >= msg.round * 50000000000000
            ) throw Errors.KpiNotMet;                                                             // $50k per round
            assert (msg.burnParityBps <= 10000) throw Errors.InvalidMessage;

            // Cryptographic Oracle Attestation Verification with Domain Separation
            val unlockHash = buildTeamUnlockHash(
                storage.networkId,
                contract.getAddress(),
                msg.round,
                msg.activeAgents,
                msg.externalRevenueUsd,
                msg.burnParityBps,
                msg.nonce,
                msg.expiry,
            );
            val sigSlice = msg.signature.beginParse();
            assert (
                isSignatureValid(unlockHash, sigSlice, storage.oraclePublicKey)
            ) throw Errors.InvalidSignature;

            // Max 10% team allocation per regular round adjusted by burn parity factor
            val roundBaseAllocation = storage.teamAllocation / 10;
            val adjustedTranche = (roundBaseAllocation * msg.burnParityBps) / 10000;

            storage.vestedAmount += adjustedTranche;
            storage.unlockedRounds.set(msg.round, true);
            storage.usedNonces.set(msg.nonce, true);
            storage.save();
        }

        ClaimTeamTokens => {
            var storage = lazy TeamVaultStorage.load();
            assert (!storage.isPaused) throw Errors.ControllerPaused;
            val config = storage.config.load();
            assert (config.jettonWallet != null) throw Errors.NotValidWallet;

            val available = storage.vestedAmount - storage.claimedAmount;
            assert (available > 0) throw Errors.BalanceError;

            storage.claimedAmount += available;
            storage.save();

            // Dispatch TEP-74 Jetton Transfer strictly to the immutable beneficiary
            val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();
            val transferMsg = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: config.jettonWallet!,
                value: 0,
                body: AskToTransfer {
                    queryId: msg.queryId,
                    jettonAmount: available,
                    transferRecipient: config.beneficiary,
                    sendExcessesTo: config.beneficiary,
                    customPayload: null,
                    forwardTonAmount: ton("0.01"),
                    forwardPayload,
                },
            });
            transferMsg.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }

        else => throw Errors.InvalidOp,
    }
}

struct TeamVestingReply {
    totalAllocation: coins
    vestedAmount: coins
    claimedAmount: coins
    isPaused: bool
    beneficiary: address
    jettonWallet: address?
}

get fun get_team_vesting_data(): TeamVestingReply {
    val storage = lazy TeamVaultStorage.load();
    val config = storage.config.load();
    return {
        totalAllocation: storage.teamAllocation,
        vestedAmount: storage.vestedAmount,
        claimedAmount: storage.claimedAmount,
        isPaused: storage.isPaused,
        beneficiary: config.beneficiary,
        jettonWallet: config.jettonWallet,
    };
}

get fun is_round_unlocked(round: int): bool {
    val storage = lazy TeamVaultStorage.load();
    val r: uint8 = round as uint8;
    return storage.unlockedRounds.get(r).isFound;
}
