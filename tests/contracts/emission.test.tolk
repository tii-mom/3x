import "@acton/build"
import "@acton/crypto"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/EmissionController.gen"
import "@contracts/common/economic-buckets"
import "@contracts/common/errors"
import "@contracts/common/messages"
import "@contracts/common/signature-domain"
import "@contracts/common/storage"

const TEST_NETWORK_ID: int32 = -239

fun setupEmissionController(): (EmissionController, KeyPair, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("emission-admin");
    val mockVault = testing.treasury("mock-vault");
    val user = testing.treasury("emission-user");

    val words = crypto.createMnemonic();
    val oracleKp = words.toKeyPair();

    val emptyNonces: map<uint64, bool> = [];
    val emptyStages: map<uint256, uint32> = [];

    val emissionStorage: EmissionStorage = {
        owner: admin.address,
        reserveVault: mockVault.address,
        oraclePublicKey: oracleKp.publicKey,
        networkId: TEST_NETWORK_ID,
        registeredAgentsCount: 0,
        usedNonces: emptyNonces,
        claimedStages: emptyStages,
        isPaused: false,
    };

    val stateInit = ContractState {
        code: build("EmissionController"),
        data: emissionStorage.toCell(),
    };
    val controllerAddress = AutoDeployAddress { stateInit }.calculateAddress();
    val controller = EmissionController {
        address: controllerAddress,
        stateInit,
    };

    val deployCtrlRes = controller.deploy(admin.address, { value: ton("1") });
    expect(deployCtrlRes).toHaveSuccessfulDeploy({ to: controller.address });

    return (controller, oracleKp, admin, mockVault, user);
}

get fun `test EmissionController registers agent with valid Ed25519 signature`() {
    val (controller, oracleKp, _admin, _mockVault, user) = setupEmissionController();

    val agentId = 1001;
    val nonce = 12345;
    val expiry = blockchain.now() + 3600;
    val paramVersion = 1;

    val regHash = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        nonce,
        expiry,
        paramVersion,
    );

    val sigSlice = crypto.rawSign(oracleKp.privateKey, regHash);
    val sigCell = beginCell().storeSlice(sigSlice).endCell();

    val regRes = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId,
        user.address,
        nonce,
        expiry,
        paramVersion,
        sigCell as Cell<bits512>,
        { value: ton("0.1") },
    );

    expect(regRes).toHaveAllSuccessfulTxs();

    val genInfo = controller.getGenerationInfo();
    expect(genInfo.totalRegistered).toEqual(1);
    expect(genInfo.currentGeneration).toEqual(0);
}

get fun `test EmissionController rejects invalid signature`() {
    val (controller, _oracleKp, _admin, _mockVault, user) = setupEmissionController();

    val agentId = 2002;
    val nonce = 9999;
    val expiry = blockchain.now() + 3600;
    val paramVersion = 1;

    val fakeWords = crypto.createMnemonic();
    val fakeKp = fakeWords.toKeyPair();

    val regHash = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        nonce,
        expiry,
        paramVersion,
    );

    val forgedSigSlice = crypto.rawSign(fakeKp.privateKey, regHash);
    val forgedSigCell = beginCell().storeSlice(forgedSigSlice).endCell();

    val failRes = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId,
        user.address,
        nonce,
        expiry,
        paramVersion,
        forgedSigCell as Cell<bits512>,
        { value: ton("0.1") },
    );

    expect(failRes).toHaveFailedTx({
        from: user.address,
        to: controller.address,
        exitCode: Errors.InvalidSignature,
    });
}

get fun `test EmissionController rejects replay nonce`() {
    val (controller, oracleKp, _admin, _mockVault, user) = setupEmissionController();

    val agentId = 3003;
    val nonce = 7777;
    val expiry = blockchain.now() + 3600;
    val paramVersion = 1;

    val regHash = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        nonce,
        expiry,
        paramVersion,
    );

    val sigSlice = crypto.rawSign(oracleKp.privateKey, regHash);
    val sigCell = beginCell().storeSlice(sigSlice).endCell();

    val firstRes = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId,
        user.address,
        nonce,
        expiry,
        paramVersion,
        sigCell as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(firstRes).toHaveAllSuccessfulTxs();

    // Replay with identical nonce
    val replayRes = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId + 1,
        user.address,
        nonce,
        expiry,
        paramVersion,
        sigCell as Cell<bits512>,
        { value: ton("0.1") },
    );

    expect(replayRes).toHaveFailedTx({
        from: user.address,
        to: controller.address,
        exitCode: Errors.ReplayNonce,
    });
}

get fun `test EmissionController rejects duplicate growth stage claim`() {
    val (controller, oracleKp, _admin, mockVault, user) = setupEmissionController();

    val agentId = 5005;
    val stage: uint8 = 1;
    val nonce1 = 8801;
    val nonce2 = 8802;
    val expiry = blockchain.now() + 3600;
    val paramVersion = 1;

    val claimHash1 = buildGrowthClaimHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        stage,
        nonce1,
        expiry,
        paramVersion,
    );
    val sigSlice1 = crypto.rawSign(oracleKp.privateKey, claimHash1);
    val sigCell1 = beginCell().storeSlice(sigSlice1).endCell();

    val claimRes1 = controller.sendClaimGrowthStage(
        user.address,
        0,
        agentId,
        user.address,
        stage,
        nonce1,
        expiry,
        paramVersion,
        sigCell1 as Cell<bits512>,
        { value: ton("0.2") },
    );
    expect(claimRes1).toHaveAllSuccessfulTxs();
    expect(controller.isStageClaimed(agentId, stage)).toEqual(true);

    // Verify message sent to mockVault is ReleaseReserveToAgent with bucketId = BUCKET_GROWTH (1)
    val expectedReleaseBody = (ReleaseReserveToAgent {
        queryId: 0,
        agentId,
        recipient: user.address,
        amount: 100000000000, // Stage 1 growth subsidy
        stage,
        bucketId: BUCKET_GROWTH,
    }).toCell();
    expect(claimRes1).toHaveTx({
        from: controller.address,
        to: mockVault.address,
        body: expectedReleaseBody,
    });

    // Attempt to claim same stage 1 with new nonce
    val claimHash2 = buildGrowthClaimHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        stage,
        nonce2,
        expiry,
        paramVersion,
    );
    val sigSlice2 = crypto.rawSign(oracleKp.privateKey, claimHash2);
    val sigCell2 = beginCell().storeSlice(sigSlice2).endCell();

    val claimRes2 = controller.sendClaimGrowthStage(
        user.address,
        0,
        agentId,
        user.address,
        stage,
        nonce2,
        expiry,
        paramVersion,
        sigCell2 as Cell<bits512>,
        { value: ton("0.2") },
    );

    expect(claimRes2).toHaveFailedTx({
        from: user.address,
        to: controller.address,
        exitCode: Errors.StageAlreadyClaimed,
    });
}
