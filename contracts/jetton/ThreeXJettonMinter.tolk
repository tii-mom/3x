import "@gen/ThreeXJettonWallet.code"
import "@contracts/common/errors"
import "@contracts/common/fees-management"
import "@contracts/common/jetton-utils"
import "@contracts/common/messages"
import "@contracts/common/sharding"
import "@contracts/common/storage"

contract ThreeXJettonMinter {
    author: "3X Protocol"
    version: "3.1.0"
    description: "Standard 3X Jetton Minter with Supply Cap. TEP-74 and TEP-89 compliant"
    storage: ThreeXMinterStorage
    incomingMessages: AllowedMessageToMinter
}

struct (0x706f7374) StopMinting {
    queryId: uint64
}

type AllowedMessageToMinter =
    | MintNewJettons
    | BurnNotificationForMinter
    | RequestWalletAddress
    | ChangeMinterAdmin
    | ClaimMinterAdmin
    | DropMinterAdmin
    | ChangeMinterMetadata
    | UpgradeMinterCode
    | StopMinting
    | TopUpTons

fun onBouncedMessage(in: InMessageBounced) {
    in.bouncedBody.skipBouncedPrefix();
    val msg = lazy InternalTransferStep.fromSlice(in.bouncedBody);

    var storage = lazy ThreeXMinterStorage.load();
    storage.totalSupply -= msg.jettonAmount;
    storage.save();
}

fun assertSenderIsAdmin(senderAddress: address, adminAddress: address?) {
    assert (senderAddress == adminAddress!) throw Errors.NotOwner;
}

fun onInternalMessage(in: InMessage) {
    if (in.body.isEmpty()) {
        return;
    }
    val msg = lazy AllowedMessageToMinter.fromSlice(in.body);

    match (msg) {
        BurnNotificationForMinter => {
            var storage = lazy ThreeXMinterStorage.load();
            val jettonWalletCode = threeXJettonWalletCompiledCode();
            assert (
                in.senderAddress ==
                calcAddressOfJettonWallet(
                    msg.burnInitiator,
                    contract.getAddress(),
                    jettonWalletCode,
                )
            ) throw Errors.NotValidWallet;
            storage.totalSupply -= msg.jettonAmount;
            storage.save();

            if (msg.sendExcessesTo == null) {
                return;
            }

            val excessesMsg = createMessage({
                bounce: BounceMode.NoBounce,
                dest: msg.sendExcessesTo,
                value: 0,
                body: ReturnExcessesBack { queryId: msg.queryId },
            });
            excessesMsg.send(SEND_MODE_IGNORE_ERRORS | SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }

        MintNewJettons => {
            var storage = lazy ThreeXMinterStorage.load();
            assertSenderIsAdmin(in.senderAddress, storage.adminAddress);
            assert (msg.mintRecipient.getWorkchain() == MY_WORKCHAIN) throw Errors.WrongWorkchain;

            // INVARIANT: Cannot mint if minting is disabled
            assert (storage.mintable) throw Errors.MintingDisabled;

            val internalTransferMsg = lazy msg
                .internalTransferMsg
                .load({ throwIfOpcodeDoesNotMatch: Errors.InvalidOp });
            val forwardTonAmount = internalTransferMsg.forwardTonAmount;
            internalTransferMsg.forwardPayload.checkIsCorrectTlbEither();

            checkAmountIsEnoughToTransfer(msg.tonAmount, forwardTonAmount, in.originalForwardFee);

            // INVARIANT: Cannot exceed configured maxSupply
            assert (
                storage.totalSupply + internalTransferMsg.jettonAmount <= storage.maxSupply
            ) throw Errors.SupplyCapExceeded;

            storage.totalSupply += internalTransferMsg.jettonAmount;
            storage.save();

            reserveToncoinsOnBalance(
                ton("0.01"),
                RESERVE_MODE_EXACT_AMOUNT,
            );

            val jettonWalletCode = threeXJettonWalletCompiledCode();
            val deployMsg = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: calcDeployedJettonWallet(
                    msg.mintRecipient,
                    contract.getAddress(),
                    jettonWalletCode,
                ),
                value: msg.tonAmount,
                body: msg.internalTransferMsg,
            });
            deployMsg.send(
                SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_BOUNCE_ON_ACTION_FAIL,
            );
        }

        StopMinting => {
            var storage = lazy ThreeXMinterStorage.load();
            assertSenderIsAdmin(in.senderAddress, storage.adminAddress);
            // Irreversible closure of minting
            storage.mintable = false;
            storage.save();
        }

        ChangeMinterAdmin => {
            var storage = lazy ThreeXMinterStorage.load();
            assertSenderIsAdmin(in.senderAddress, storage.adminAddress);
            storage.nextAdminAddress = msg.newAdminAddress;
            storage.save();
        }

        ClaimMinterAdmin => {
            var storage = lazy ThreeXMinterStorage.load();
            assert (in.senderAddress == storage.nextAdminAddress!) throw Errors.NotOwner;
            storage.adminAddress = storage.nextAdminAddress;
            storage.nextAdminAddress = null;
            storage.save();
        }

        DropMinterAdmin => {
            var storage = lazy ThreeXMinterStorage.load();
            assertSenderIsAdmin(in.senderAddress, storage.adminAddress);
            storage.adminAddress = null;
            storage.nextAdminAddress = null;
            storage.save();
        }

        ChangeMinterMetadata => {
            var storage = lazy ThreeXMinterStorage.load();
            assertSenderIsAdmin(in.senderAddress, storage.adminAddress);
            storage.metadata = msg.newMetadata;
            storage.save();
        }

        RequestWalletAddress => {
            val jettonWalletCode = threeXJettonWalletCompiledCode();
            val isBasechain = msg.ownerAddress.getWorkchain() == MY_WORKCHAIN;
            val walletAddress = isBasechain
                ? calcAddressOfJettonWallet(
                    msg.ownerAddress,
                    contract.getAddress(),
                    jettonWalletCode,
                )
                : null;

            val response = ResponseWalletAddress {
                queryId: msg.queryId,
                jettonWalletAddress: walletAddress,
                ownerAddress: msg.includeOwnerAddress ? msg.ownerAddress.toCell() : null,
            };

            val replyMsg = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: 0,
                body: response,
            });
            replyMsg.send(SEND_MODE_IGNORE_ERRORS | SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }

        UpgradeMinterCode => {
            val storage = lazy ThreeXMinterStorage.load();
            assertSenderIsAdmin(in.senderAddress, storage.adminAddress);
            contract.setCodePostponed(msg.newCode);
            contract.setData(msg.newData);
        }

        TopUpTons => {
            // accept gas
        }

        else => throw Errors.InvalidOp,
    }
}

get fun get_jetton_data(): JettonDataReply {
    val storage = lazy ThreeXMinterStorage.load();
    val jettonWalletCode = threeXJettonWalletCompiledCode();

    return {
        totalSupply: storage.totalSupply,
        mintable: storage.mintable,
        adminAddress: storage.adminAddress,
        jettonContent: storage.metadata,
        jettonWalletCode,
    };
}

get fun get_wallet_address(ownerAddress: address): address {
    val jettonWalletCode = threeXJettonWalletCompiledCode();
    return calcAddressOfJettonWallet(ownerAddress, contract.getAddress(), jettonWalletCode);
}
