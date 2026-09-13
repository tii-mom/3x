import "@contracts/common/errors"
import "@contracts/common/messages"
import "@contracts/common/storage"

type AllowedMessageToVault =
    | SetEmissionController
    | SetVaultJettonWallet
    | ReleaseReserveToAgent
    | PauseReserveVault
    | UnpauseReserveVault

fun onBouncedMessage(in: InMessageBounced) {
    var body = in.bouncedBody;
    body.skipBouncedPrefix();
    val op = body.loadUint(32);
    if (op == 0x0f8a7ea5) {
        // AskToTransfer opcode
        body.skipMessageQueryId();
        val bouncedJettonAmount = body.loadCoins();

        var storage = lazy AiReserveStorage.load();
        if (storage.totalReleased >= bouncedJettonAmount) {
            storage.totalReleased -= bouncedJettonAmount;
            storage.save();
        }
    }
}

fun onInternalMessage(in: InMessage) {
    if (in.body.isEmpty()) {
        return;
    }

    val msg = lazy AllowedMessageToVault.fromSlice(in.body);

    match (msg) {
        SetEmissionController => {
            var storage = lazy AiReserveStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            var config = storage.config.load();
            config.emissionController = msg.controller;
            storage.config = config.toCell();
            storage.save();
        }

        SetVaultJettonWallet => {
            var storage = lazy AiReserveStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            var config = storage.config.load();
            config.jettonWallet = msg.jettonWallet;
            storage.config = config.toCell();
            storage.save();
        }

        PauseReserveVault => {
            var storage = lazy AiReserveStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.isPaused = true;
            storage.save();
        }

        UnpauseReserveVault => {
            var storage = lazy AiReserveStorage.load();
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.isPaused = false;
            storage.save();
        }

        ReleaseReserveToAgent => {
            var storage = lazy AiReserveStorage.load();
            assert (!storage.isPaused) throw Errors.ControllerPaused;
            val config = storage.config.load();
            assert (config.emissionController != null) throw Errors.UnauthorizedCaller;
            assert (in.senderAddress == config.emissionController!) throw Errors.UnauthorizedCaller;
            assert (config.jettonWallet != null) throw Errors.NotValidWallet;

            // Global 80% Hard Cap
            assert (
                storage.totalReleased + msg.amount <= storage.globalHardCap
            ) throw Errors.CapExceeded;

            // Sub-bucket Caps: 0 = Seed (4%), 1 = Compute (60%), 2 = Ecosystem (16%)
            var buckets = storage.buckets.load();
            if (msg.bucketId == 0) {
                assert (
                    buckets.seedReleased + msg.amount <= buckets.seedCap
                ) throw Errors.CapExceeded;
                buckets.seedReleased += msg.amount;
            } else if (msg.bucketId == 1) {
                assert (
                    buckets.computeReleased + msg.amount <= buckets.computeCap
                ) throw Errors.CapExceeded;
                buckets.computeReleased += msg.amount;
            } else if (msg.bucketId == 2) {
                assert (
                    buckets.ecosystemReleased + msg.amount <= buckets.ecosystemCap
                ) throw Errors.CapExceeded;
                buckets.ecosystemReleased += msg.amount;
            } else {
                throw Errors.InvalidOp;
            }

            storage.totalReleased += msg.amount;
            storage.buckets = buckets.toCell();
            storage.save();

            // Dispatch TEP-74 Jetton Transfer from Vault's Jetton Wallet
            val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();
            val transferMsg = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: config.jettonWallet!,
                value: 0,
                body: AskToTransfer {
                    queryId: msg.queryId,
                    jettonAmount: msg.amount,
                    transferRecipient: msg.recipient,
                    sendExcessesTo: msg.recipient,
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

struct VaultDataReply {
    globalHardCap: coins
    totalReleased: coins
    totalReserved: coins
    isPaused: bool
    owner: address
    emissionController: address?
    jettonWallet: address?
}

get fun get_vault_data(): VaultDataReply {
    val storage = lazy AiReserveStorage.load();
    val config = storage.config.load();
    return {
        globalHardCap: storage.globalHardCap,
        totalReleased: storage.totalReleased,
        totalReserved: storage.totalReserved,
        isPaused: storage.isPaused,
        owner: storage.owner,
        emissionController: config.emissionController,
        jettonWallet: config.jettonWallet,
    };
}

get fun get_bucket_released(bucketId: int): (coins, coins) {
    val storage = lazy AiReserveStorage.load();
    val buckets = storage.buckets.load();
    if (bucketId == 0) {
        return (buckets.seedCap, buckets.seedReleased);
    } else if (bucketId == 1) {
        return (buckets.computeCap, buckets.computeReleased);
    } else if (bucketId == 2) {
        return (buckets.ecosystemCap, buckets.ecosystemReleased);
    }
    return (0, 0);
}
