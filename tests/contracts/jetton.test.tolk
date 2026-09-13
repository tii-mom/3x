import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/ThreeXJettonMinter.gen"
import "@wrappers/ThreeXJettonWallet.gen"
import "@contracts/common/errors"
import "@contracts/common/messages"
import "@contracts/common/storage"
import "test-utils"

get fun `test mint by admin increases total supply`() {
    val (minter, admin, user) = setupJettonTest();
    val mintAmount = ton("1000");

    val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();

    val internalTransferMsg: InternalTransferStep = {
        queryId: 0,
        jettonAmount: mintAmount,
        transferInitiator: admin.address,
        sendExcessesTo: admin.address,
        forwardTonAmount: ton("0.05"),
        forwardPayload,
    };

    val _mintRes = minter.sendMintNewJettons(
        admin.address,
        0,
        user.address,
        ton("0.2"),
        internalTransferMsg,
        { value: ton("0.3"), bounce: true },
    );

    val jettonData = minter.getJettonData();
    expect(jettonData.totalSupply).toEqual(mintAmount);
    expect(jettonData.mintable).toEqual(true);

    val userWalletAddr = minter.getWalletAddress(user.address);
    val userWallet = ThreeXJettonWallet.fromAddress(userWalletAddr);
    val walletData = userWallet.getWalletData();
    expect(walletData.jettonBalance).toEqual(mintAmount);
    expect(walletData.ownerAddress).toEqual(user.address);
}

get fun `test mint by unauthorized sender fails with NotAuthorized`() {
    val (minter, _admin, _user) = setupJettonTest();
    val attacker = testing.treasury("attacker");

    val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();

    val internalTransferMsg: InternalTransferStep = {
        queryId: 0,
        jettonAmount: ton("100"),
        transferInitiator: attacker.address,
        sendExcessesTo: attacker.address,
        forwardTonAmount: ton("0.05"),
        forwardPayload,
    };

    val res = minter.sendMintNewJettons(
        attacker.address,
        0,
        attacker.address,
        ton("0.2"),
        internalTransferMsg,
        { value: ton("0.3"), bounce: true },
    );

    expect(res).toHaveFailedTx<MintNewJettons>({
        from: attacker.address,
        to: minter.address,
        exitCode: Errors.NotOwner,
    });
}

get fun `test mint exceeding maxSupply fails with MaxSupplyExceeded`() {
    val (minter, admin, user) = setupJettonTest();
    val excessiveAmount = TEST_REFERENCE_SUPPLY + 1;

    val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();

    val internalTransferMsg: InternalTransferStep = {
        queryId: 0,
        jettonAmount: excessiveAmount,
        transferInitiator: admin.address,
        sendExcessesTo: admin.address,
        forwardTonAmount: ton("0.05"),
        forwardPayload,
    };

    val res = minter.sendMintNewJettons(
        admin.address,
        0,
        user.address,
        ton("0.2"),
        internalTransferMsg,
        { value: ton("0.3"), bounce: true },
    );

    expect(res).toHaveFailedTx<MintNewJettons>({
        from: admin.address,
        to: minter.address,
        exitCode: Errors.SupplyCapExceeded,
    });
}

get fun `test stop minting permanently disables minting`() {
    val (minter, admin, user) = setupJettonTest();

    val _stopRes = minter.sendStopMinting(
        admin.address,
        0,
        { value: ton("0.05"), bounce: true },
    );

    val jettonData = minter.getJettonData();
    expect(jettonData.mintable).toEqual(false);

    val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();

    val internalTransferMsg: InternalTransferStep = {
        queryId: 0,
        jettonAmount: ton("100"),
        transferInitiator: admin.address,
        sendExcessesTo: admin.address,
        forwardTonAmount: ton("0.05"),
        forwardPayload,
    };

    val mintRes = minter.sendMintNewJettons(
        admin.address,
        0,
        user.address,
        ton("0.2"),
        internalTransferMsg,
        { value: ton("0.3"), bounce: true },
    );

    expect(mintRes).toHaveFailedTx<MintNewJettons>({
        from: admin.address,
        to: minter.address,
        exitCode: Errors.MintingDisabled,
    });
}

get fun `test transfer between wallets updates balances`() {
    val (minter, admin, alice) = setupJettonTest();
    val bob = testing.treasury("bob");
    val mintAmount = ton("1000");

    val forwardPayload = beginCell().storeMaybeRef(null).endCell().beginParse();
    val internalTransferMsg: InternalTransferStep = {
        queryId: 0,
        jettonAmount: mintAmount,
        transferInitiator: admin.address,
        sendExcessesTo: admin.address,
        forwardTonAmount: ton("0.05"),
        forwardPayload,
    };

    minter.sendMintNewJettons(
        admin.address,
        0,
        alice.address,
        ton("0.2"),
        internalTransferMsg,
        { value: ton("0.3"), bounce: true },
    );

    val aliceWalletAddr = minter.getWalletAddress(alice.address);
    val aliceWallet = ThreeXJettonWallet.fromAddress(aliceWalletAddr);

    val transferPayload: PayloadInline = { value: beginCell().endCell().beginParse() };

    val transferAmount = ton("200");
    val transferRes = aliceWallet.sendAskToTransfer(
        alice.address,
        0,
        transferAmount,
        bob.address,
        alice.address,
        null,
        ton("0.05"),
        transferPayload,
        { value: ton("0.25"), bounce: true },
    );

    expect(transferRes).toHaveAllSuccessfulTxs();

    val aliceData = aliceWallet.getWalletData();
    expect(aliceData.jettonBalance).toEqual(mintAmount - transferAmount);

    val bobWalletAddr = minter.getWalletAddress(bob.address);
    val bobWallet = ThreeXJettonWallet.fromAddress(bobWalletAddr);
    val bobData = bobWallet.getWalletData();
    expect(bobData.jettonBalance).toEqual(transferAmount);
}
