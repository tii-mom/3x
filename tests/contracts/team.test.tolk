import "@acton/build"
import "@acton/crypto"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/TeamUnlockVault.gen"
import "@contracts/common/errors"
import "@contracts/common/signature-domain"
import "@contracts/common/storage"
import "beta-tokenomics-fixtures"

const TEST_NETWORK_ID: int32 = -239
const TEAM_ALLOCATION: coins = BETA_TEAM_ALLOCATION // 100M * 10^9 (10% of 1B Reference)

fun setupTeamUnlockVault(): (TeamUnlockVault, KeyPair, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("team-admin");
    val beneficiary = testing.treasury("team-beneficiary");
    val mockJettonWallet = testing.treasury("mock-team-wallet");

    val words = crypto.createMnemonic();
    val oracleKp = words.toKeyPair();

    val emptyRounds: map<uint8, bool> = [];
    val emptyNonces: map<uint64, bool> = [];

    val config: TeamVaultConfig = {
        beneficiary: beneficiary.address,
        jettonWallet: mockJettonWallet.address,
    };

    val vaultStorage: TeamVaultStorage = {
        owner: admin.address,
        teamAllocation: TEAM_ALLOCATION,
        vestedAmount: 0,
        claimedAmount: 0,
        oraclePublicKey: oracleKp.publicKey,
        networkId: TEST_NETWORK_ID,
        unlockedRounds: emptyRounds,
        usedNonces: emptyNonces,
        isPaused: false,
        config: config.toCell(),
    };

    val stateInit = ContractState {
        code: build("TeamUnlockVault"),
        data: vaultStorage.toCell(),
    };
    val vaultAddress = AutoDeployAddress { stateInit }.calculateAddress();
    val vault = TeamUnlockVault {
        address: vaultAddress,
        stateInit,
    };

    val deployRes = vault.deploy(admin.address, { value: ton("1") });
    expect(deployRes).toHaveSuccessfulDeploy({ to: vault.address });

    return (vault, oracleKp, admin, beneficiary, mockJettonWallet);
}

get fun `test TeamUnlockVault deployment and initial state`() {
    val (vault, _oracleKp, _admin, beneficiary, _mockWallet) = setupTeamUnlockVault();

    val data = vault.getTeamVestingData();
    expect(data.totalAllocation).toEqual(TEAM_ALLOCATION);
    expect(data.vestedAmount).toEqual(0);
    expect(data.claimedAmount).toEqual(0);
    expect(data.beneficiary).toEqual(beneficiary.address);
    expect(data.isPaused).toEqual(false);
}

get fun `test TeamUnlockVault attests round 1 with valid oracle signature and KPI`() {
    val (vault, oracleKp, admin, _beneficiary, _mockWallet) = setupTeamUnlockVault();

    val round: uint8 = 1;
    val activeAgents: uint32 = 1500;
    val revenueUsd: coins = 60000000000000; // $60,000
    val burnParityBps: uint16 = 8000;       // 80% parity
    val nonce = 1001;
    val expiry = blockchain.now() + 3600;

    val unlockHash = buildTeamUnlockHash(
        TEST_NETWORK_ID,
        vault.address,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce,
        expiry,
    );

    val sigSlice = crypto.rawSign(oracleKp.privateKey, unlockHash);
    val sigCell = beginCell().storeSlice(sigSlice).endCell();

    val attestRes = vault.sendAttestTeamRound(
        admin.address,
        0,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce,
        expiry,
        sigCell as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(attestRes).toHaveAllSuccessfulTxs();

    // 10% base round = 10M, at 80% parity = 8M
    val expectedVested: coins = 8000000000000000;
    val data = vault.getTeamVestingData();
    expect(data.vestedAmount).toEqual(expectedVested);
    expect(vault.isRoundUnlocked(1)).toEqual(true);
}

get fun `test TeamUnlockVault rejects duplicate unlock of same round`() {
    val (vault, oracleKp, admin, _beneficiary, _mockWallet) = setupTeamUnlockVault();

    val round: uint8 = 1;
    val activeAgents: uint32 = 1500;
    val revenueUsd: coins = 60000000000000;
    val burnParityBps: uint16 = 10000;
    val nonce1 = 2001;
    val nonce2 = 2002;
    val expiry = blockchain.now() + 3600;

    val unlockHash1 = buildTeamUnlockHash(
        TEST_NETWORK_ID,
        vault.address,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce1,
        expiry,
    );
    val sigCell1 = beginCell()
        .storeSlice(crypto.rawSign(oracleKp.privateKey, unlockHash1))
        .endCell();

    val res1 = vault.sendAttestTeamRound(
        admin.address,
        0,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce1,
        expiry,
        sigCell1 as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(res1).toHaveAllSuccessfulTxs();

    // Attempt round 1 again
    val unlockHash2 = buildTeamUnlockHash(
        TEST_NETWORK_ID,
        vault.address,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce2,
        expiry,
    );
    val sigCell2 = beginCell()
        .storeSlice(crypto.rawSign(oracleKp.privateKey, unlockHash2))
        .endCell();

    val failRes = vault.sendAttestTeamRound(
        admin.address,
        0,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce2,
        expiry,
        sigCell2 as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(failRes).toHaveFailedTx({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.RoundAlreadyUnlocked,
    });
}

get fun `test TeamUnlockVault rejects unlock when KPI not met`() {
    val (vault, oracleKp, admin, _beneficiary, _mockWallet) = setupTeamUnlockVault();

    val round: uint8 = 1;
    val lowActiveAgents: uint32 = 500; // Under 1000 requirement
    val revenueUsd: coins = 60000000000000;
    val burnParityBps: uint16 = 10000;
    val nonce = 3001;
    val expiry = blockchain.now() + 3600;

    val unlockHash = buildTeamUnlockHash(
        TEST_NETWORK_ID,
        vault.address,
        round,
        lowActiveAgents,
        revenueUsd,
        burnParityBps,
        nonce,
        expiry,
    );
    val sigCell = beginCell().storeSlice(crypto.rawSign(oracleKp.privateKey, unlockHash)).endCell();

    val failRes = vault.sendAttestTeamRound(
        admin.address,
        0,
        round,
        lowActiveAgents,
        revenueUsd,
        burnParityBps,
        nonce,
        expiry,
        sigCell as Cell<bits512>,
        { value: ton("0.1") },
    );
    expect(failRes).toHaveFailedTx({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.KpiNotMet,
    });
}

get fun `test TeamUnlockVault claims vested tokens to fixed beneficiary`() {
    val (vault, oracleKp, admin, beneficiary, _mockWallet) = setupTeamUnlockVault();

    val round: uint8 = 1;
    val activeAgents: uint32 = 1200;
    val revenueUsd: coins = 55000000000000;
    val burnParityBps: uint16 = 10000; // 100%
    val nonce = 4001;
    val expiry = blockchain.now() + 3600;

    val unlockHash = buildTeamUnlockHash(
        TEST_NETWORK_ID,
        vault.address,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce,
        expiry,
    );
    val sigCell = beginCell().storeSlice(crypto.rawSign(oracleKp.privateKey, unlockHash)).endCell();

    vault.sendAttestTeamRound(
        admin.address,
        0,
        round,
        activeAgents,
        revenueUsd,
        burnParityBps,
        nonce,
        expiry,
        sigCell as Cell<bits512>,
        { value: ton("0.1") },
    );

    // Claim tokens
    val claimRes = vault.sendClaimTeamTokens(beneficiary.address, 1, { value: ton("0.1") });
    expect(claimRes).toHaveAllSuccessfulTxs();

    val data = vault.getTeamVestingData();
    expect(data.claimedAmount).toEqual(data.vestedAmount);
}
