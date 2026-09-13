import "@acton/build"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/AIReserveVault.gen"
import "@contracts/common/economic-buckets"
import "@contracts/common/errors"
import "@contracts/common/storage"
import "beta-tokenomics-fixtures"

const GLOBAL_HARD_CAP: coins = BETA_AI_RESERVE_CAP // 800M * 10^9 (80%)
const SEED_CAP: coins = BETA_SEED_CAP // 40M * 10^9 (4%)
const GROWTH_CAP: coins = BETA_GROWTH_CAP // 600M * 10^9 (60%)
const DEMAND_CAP: coins = BETA_DEMAND_CAP // 160M * 10^9 (16%)

fun setupReserveVault(): (AiReserveVault, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("reserve-admin");
    val mockController = testing.treasury("mock-controller");
    val mockJettonWallet = testing.treasury("mock-vault-wallet");
    val user = testing.treasury("reserve-user");

    val bucketCaps: AiReserveBucketCaps = {
        seedCap: SEED_CAP,
        seedReleased: 0,
        growthCap: GROWTH_CAP,
        growthReleased: 0,
        demandCap: DEMAND_CAP,
        demandReleased: 0,
    };

    val config: AiReserveConfig = {
        emissionController: mockController.address,
        jettonWallet: mockJettonWallet.address,
    };

    val vaultStorage: AiReserveStorage = {
        owner: admin.address,
        globalHardCap: GLOBAL_HARD_CAP,
        totalReleased: 0,
        totalReserved: 0,
        isPaused: false,
        config: config.toCell(),
        buckets: bucketCaps.toCell(),
    };

    val stateInit = ContractState {
        code: build("AIReserveVault"),
        data: vaultStorage.toCell(),
    };
    val vaultAddress = AutoDeployAddress { stateInit }.calculateAddress();
    val vault = AiReserveVault {
        address: vaultAddress,
        stateInit,
    };

    val deployVaultRes = vault.deploy(admin.address, { value: ton("1") });
    expect(deployVaultRes).toHaveSuccessfulDeploy({ to: vault.address });

    return (vault, admin, mockController, user);
}

get fun `test AIReserveVault permissions and pause`() {
    val (vault, admin, _controller, user) = setupReserveVault();

    // Non-owner cannot set controller
    val failRes = vault.sendSetEmissionController(
        user.address,
        1,
        user.address,
        { value: ton("0.05") },
    );
    expect(failRes).toHaveFailedTx({
        from: user.address,
        to: vault.address,
        exitCode: Errors.NotOwner,
    });

    // Owner can pause vault
    val pauseRes = vault.sendPauseReserveVault(admin.address, 2, { value: ton("0.05") });
    expect(pauseRes).toHaveAllSuccessfulTxs();

    val vaultData = vault.getVaultData();
    expect(vaultData.isPaused).toEqual(true);

    // Owner can unpause vault
    val unpauseRes = vault.sendUnpauseReserveVault(admin.address, 3, { value: ton("0.05") });
    expect(unpauseRes).toHaveAllSuccessfulTxs();

    val unpausedData = vault.getVaultData();
    expect(unpausedData.isPaused).toEqual(false);
}

get fun `test AIReserveVault rejects release from unauthorized caller`() {
    val (vault, _admin, _controller, user) = setupReserveVault();

    val directRelease = vault.sendReleaseReserveToAgent(
        user.address,
        1,
        42,
        user.address,
        ton("100"),
        1,
        BUCKET_DEMAND,
        { value: ton("0.1") },
    );

    expect(directRelease).toHaveFailedTx({
        from: user.address,
        to: vault.address,
        exitCode: Errors.UnauthorizedCaller,
    });
}

get fun `test AIReserveVault releases tokens via controller and enforces bucket cap`() {
    val (vault, _admin, controller, user) = setupReserveVault();

    // Controller releases 100 3X from Demand bucket (bucket 2)
    val releaseRes = vault.sendReleaseReserveToAgent(
        controller.address,
        100,
        999,
        user.address,
        ton("100"),
        1,
        BUCKET_DEMAND,
        { value: ton("0.1") },
    );
    expect(releaseRes).toHaveAllSuccessfulTxs();

    val vaultData = vault.getVaultData();
    expect(vaultData.totalReleased).toEqual(ton("100"));

    val (demandCap, demandReleased) = vault.getBucketReleased(BUCKET_DEMAND);
    expect(demandCap).toEqual(DEMAND_CAP);
    expect(demandReleased).toEqual(ton("100"));

    // Attempt to exceed Seed cap (bucket 0)
    val excessiveSeed = SEED_CAP + 1;
    val failCapRes = vault.sendReleaseReserveToAgent(
        controller.address,
        101,
        1000,
        user.address,
        excessiveSeed,
        1,
        BUCKET_SEED,
        { value: ton("0.1") },
    );
    expect(failCapRes).toHaveFailedTx({
        from: controller.address,
        to: vault.address,
        exitCode: Errors.CapExceeded,
    });
}

get fun `test AIReserveVault releases from Growth bucket and preserves Demand bucket`() {
    val (vault, _admin, controller, user) = setupReserveVault();

    // Controller releases 200 3X from Growth bucket (bucket 1)
    val releaseRes = vault.sendReleaseReserveToAgent(
        controller.address,
        200,
        1001,
        user.address,
        ton("200"),
        1,
        BUCKET_GROWTH,
        { value: ton("0.1") },
    );
    expect(releaseRes).toHaveAllSuccessfulTxs();

    val vaultData = vault.getVaultData();
    expect(vaultData.totalReleased).toEqual(ton("200"));

    val (growthCap, growthReleased) = vault.getBucketReleased(BUCKET_GROWTH);
    expect(growthCap).toEqual(GROWTH_CAP);
    expect(growthReleased).toEqual(ton("200"));

    // Demand bucket must remain unaffected (released = 0)
    val (demandCap, demandReleased) = vault.getBucketReleased(BUCKET_DEMAND);
    expect(demandCap).toEqual(DEMAND_CAP);
    expect(demandReleased).toEqual(0);

    // Attempt to exceed Growth cap
    val excessiveGrowth = GROWTH_CAP + 1;
    val failCapRes = vault.sendReleaseReserveToAgent(
        controller.address,
        201,
        1002,
        user.address,
        excessiveGrowth,
        1,
        BUCKET_GROWTH,
        { value: ton("0.1") },
    );
    expect(failCapRes).toHaveFailedTx({
        from: controller.address,
        to: vault.address,
        exitCode: Errors.CapExceeded,
    });
}

get fun `test reference tokenomics model arithmetic invariants`() {
    // Prove AI Economy internal accounting: 40M (Seed) + 600M (Growth) + 160M (Demand) = 800M (Reserve)
    expect(BETA_SEED_CAP + BETA_GROWTH_CAP + BETA_DEMAND_CAP).toEqual(BETA_AI_RESERVE_CAP);

    // Prove Outer allocation: 800M (Reserve) + 100M (Team) + 50M (LP) + 50M (Community) = 1B (Reference Supply)
    expect(
        BETA_AI_RESERVE_CAP + BETA_TEAM_ALLOCATION + BETA_LP_ALLOCATION + BETA_COMMUNITY_ALLOCATION,
    ).toEqual(BETA_REFERENCE_SUPPLY);
}
