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
import "beta-tokenomics-fixtures"

const TEST_NETWORK_ID: int32 = -239

fun setupEmissionController(): (EmissionController, KeyPair, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("emission-admin");
    val mockVault = testing.treasury("mock-vault");
    val user = testing.treasury("emission-user");

    val words = crypto.createMnemonic();
    val oracleKp = words.toKeyPair();

    val emptyNonces: map<uint64, bool> = [];
    val emptyAgents: map<uint256, AgentRecord> = [];
    val emptyOwnerAgents: map<address, uint256> = [];

    val emissionStorage: EmissionStorage = {
        owner: admin.address,
        reserveVault: mockVault.address,
        oraclePublicKey: oracleKp.publicKey,
        networkId: TEST_NETWORK_ID,
        registeredAgentsCount: 0,
        usedNonces: emptyNonces,
        agents: emptyAgents,
        ownerAgents: emptyOwnerAgents,
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

    // Verify AgentRecord created in storage
    val agentOpt = controller.getAgentRecord(agentId);
    expect(agentOpt).toBeNotNull();
    val agent = agentOpt!;
    expect(agent.agentId).toEqual(agentId);
    expect(agent.ownerAddress).toEqual(user.address);
    expect(agent.generation).toEqual(0);
    expect(agent.registeredIndex).toEqual(0);
    expect(agent.initialSeedBasis).toEqual(GENESIS_SEED_ENTITLEMENT);
    expect(agent.growthVaultCap).toEqual(GENESIS_GROWTH_ENTITLEMENT);
    expect(agent.claimedStagesMask).toEqual(0);

    // Verify owner mapping
    val ownerAgentOpt = controller.getAgentByOwner(user.address);
    expect(ownerAgentOpt).toBeNotNull();
    expect(ownerAgentOpt!).toEqual(agentId);
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
    val regNonce = 7701;
    val regExpiry = blockchain.now() + 3600;
    val regHash = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        regNonce,
        regExpiry,
        1,
    );
    val regSig = crypto.rawSign(oracleKp.privateKey, regHash);
    val regSigCell = beginCell().storeSlice(regSig).endCell();
    val regRes = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId,
        user.address,
        regNonce,
        regExpiry,
        1,
        regSigCell as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(regRes).toHaveAllSuccessfulTxs();

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

get fun `test EmissionController rejects duplicate agent registration`() {
    val (controller, oracleKp, _admin, _mockVault, user) = setupEmissionController();
    val user2 = testing.treasury("emission-user-2");

    val agentId = 6001;
    val nonce1 = 10001;
    val nonce2 = 10002;
    val expiry = blockchain.now() + 3600;
    val paramVersion = 1;

    val regHash1 = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user.address,
        nonce1,
        expiry,
        paramVersion,
    );
    val sig1 = crypto.rawSign(oracleKp.privateKey, regHash1);
    val sigCell1 = beginCell().storeSlice(sig1).endCell();

    val regRes1 = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId,
        user.address,
        nonce1,
        expiry,
        paramVersion,
        sigCell1 as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(regRes1).toHaveAllSuccessfulTxs();

    // Attempt to register same agentId with different owner
    val regHash2 = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId,
        user2.address,
        nonce2,
        expiry,
        paramVersion,
    );
    val sig2 = crypto.rawSign(oracleKp.privateKey, regHash2);
    val sigCell2 = beginCell().storeSlice(sig2).endCell();

    val regRes2 = controller.sendRegisterPrimaryAi(
        user2.address,
        0,
        agentId,
        user2.address,
        nonce2,
        expiry,
        paramVersion,
        sigCell2 as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(regRes2).toHaveFailedTx({
        from: user2.address,
        to: controller.address,
        exitCode: Errors.DuplicateAgent,
    });
}

get fun `test EmissionController enforces One Eligible Owner One Primary AI`() {
    val (controller, oracleKp, _admin, _mockVault, user) = setupEmissionController();

    val agentId1 = 7001;
    val agentId2 = 7002;
    val nonce1 = 20001;
    val nonce2 = 20002;
    val expiry = blockchain.now() + 3600;
    val paramVersion = 1;

    // Register first Primary AI for user
    val regHash1 = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId1,
        user.address,
        nonce1,
        expiry,
        paramVersion,
    );
    val sig1 = crypto.rawSign(oracleKp.privateKey, regHash1);
    val sigCell1 = beginCell().storeSlice(sig1).endCell();

    val regRes1 = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId1,
        user.address,
        nonce1,
        expiry,
        paramVersion,
        sigCell1 as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(regRes1).toHaveAllSuccessfulTxs();

    // Attempt to register second Primary AI with same owner address
    val regHash2 = buildRegistrationHash(
        TEST_NETWORK_ID,
        controller.address,
        agentId2,
        user.address,
        nonce2,
        expiry,
        paramVersion,
    );
    val sig2 = crypto.rawSign(oracleKp.privateKey, regHash2);
    val sigCell2 = beginCell().storeSlice(sig2).endCell();

    val regRes2 = controller.sendRegisterPrimaryAi(
        user.address,
        0,
        agentId2,
        user.address,
        nonce2,
        expiry,
        paramVersion,
        sigCell2 as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(regRes2).toHaveFailedTx({
        from: user.address,
        to: controller.address,
        exitCode: Errors.DuplicateOwner,
    });
}

get fun `test G0 to G7 entitlement table and halving progression`() {
    val (controller, _oracleKp, _admin, _mockVault, _user) = setupEmissionController();

    // G0 (Genesis): 5,000 Seed / 75,000 Growth
    val (seed0, growth0) = controller.getGenerationEntitlement(0);
    expect(seed0).toEqual(5000000000000);
    expect(growth0).toEqual(75000000000000);

    // G1: 2,500 Seed / 37,500 Growth
    val (seed1, growth1) = controller.getGenerationEntitlement(1);
    expect(seed1).toEqual(2500000000000);
    expect(growth1).toEqual(37500000000000);

    // G2: 1,250 Seed / 18,750 Growth
    val (seed2, growth2) = controller.getGenerationEntitlement(2);
    expect(seed2).toEqual(1250000000000);
    expect(growth2).toEqual(18750000000000);

    // G3: 625 Seed / 9,375 Growth
    val (seed3, growth3) = controller.getGenerationEntitlement(3);
    expect(seed3).toEqual(625000000000);
    expect(growth3).toEqual(9375000000000);

    // G4: 312.5 Seed / 4,687.5 Growth
    val (seed4, growth4) = controller.getGenerationEntitlement(4);
    expect(seed4).toEqual(312500000000);
    expect(growth4).toEqual(4687500000000);

    // G5: 156.25 Seed / 2,343.75 Growth
    val (seed5, growth5) = controller.getGenerationEntitlement(5);
    expect(seed5).toEqual(156250000000);
    expect(growth5).toEqual(2343750000000);

    // G6: 78.125 Seed / 1,171.875 Growth
    val (seed6, growth6) = controller.getGenerationEntitlement(6);
    expect(seed6).toEqual(78125000000);
    expect(growth6).toEqual(1171875000000);

    // G7: 39.0625 Seed / 585.9375 Growth
    val (seed7, growth7) = controller.getGenerationEntitlement(7);
    expect(seed7).toEqual(39062500000);
    expect(growth7).toEqual(585937500000);

    // Mature Era (G >= 8): 0 Seed / 0 Growth
    val (seed8, growth8) = controller.getGenerationEntitlement(8);
    expect(seed8).toEqual(0);
    expect(growth8).toEqual(0);
}

get fun `test Mature Era registration rejection when capacity reached`() {
    val admin = testing.treasury("mature-admin");
    val mockVault = testing.treasury("mature-mock-vault");
    val user = testing.treasury("mature-user");

    val words = crypto.createMnemonic();
    val oracleKp = words.toKeyPair();

    val emptyNonces: map<uint64, bool> = [];
    val emptyAgents: map<uint256, AgentRecord> = [];
    val emptyOwnerAgents: map<address, uint256> = [];

    // Initialize controller at maximum capacity (255,000)
    val emissionStorage: EmissionStorage = {
        owner: admin.address,
        reserveVault: mockVault.address,
        oraclePublicKey: oracleKp.publicKey,
        networkId: TEST_NETWORK_ID,
        registeredAgentsCount: 255000,
        usedNonces: emptyNonces,
        agents: emptyAgents,
        ownerAgents: emptyOwnerAgents,
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
    controller.deploy(admin.address, { value: ton("1") });

    val genInfo = controller.getGenerationInfo();
    expect(genInfo.totalRegistered).toEqual(255000);
    expect(genInfo.currentGeneration).toEqual(8); // Mature Era

    // Attempt to register 255,001st agent
    val agentId = 88888;
    val nonce = 30001;
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
    val sig = crypto.rawSign(oracleKp.privateKey, regHash);
    val sigCell = beginCell().storeSlice(sig).endCell();

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
    expect(regRes).toHaveFailedTx({
        from: user.address,
        to: controller.address,
        exitCode: Errors.MatureEraNoSubsidy,
    });
}
