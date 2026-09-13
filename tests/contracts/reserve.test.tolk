import "@acton/build"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/AIReserveVault.gen"
import "@contracts/common/errors"
import "@contracts/common/storage"

const GLOBAL_HARD_CAP: coins = 2400000000000000000 // 2.4B * 10^9
const SEED_CAP: coins = 120000000000000000 // 120M * 10^9
const COMPUTE_CAP: coins = 1800000000000000000 // 1.8B * 10^9
const ECOSYSTEM_CAP: coins = 480000000000000000 // 480M * 10^9

fun setupReserveVault(): (AiReserveVault, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("reserve-admin");
    val mockController = testing.treasury("mock-controller");
    val mockJettonWallet = testing.treasury("mock-vault-wallet");
    val user = testing.treasury("reserve-user");

    val bucketCaps: AiReserveBucketCaps = {
        seedCap: SEED_CAP,
        seedReleased: 0,
        computeCap: COMPUTE_CAP,
        computeReleased: 0,
        ecosystemCap: ECOSYSTEM_CAP,
        ecosystemReleased: 0,
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
        2,
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

    // Controller releases 100 3X from Ecosystem bucket (bucket 2)
    val releaseRes = vault.sendReleaseReserveToAgent(
        controller.address,
        100,
        999,
        user.address,
        ton("100"),
        1,
        2,
        { value: ton("0.1") },
    );
    expect(releaseRes).toHaveAllSuccessfulTxs();

    val vaultData = vault.getVaultData();
    expect(vaultData.totalReleased).toEqual(ton("100"));

    val (ecoCap, ecoReleased) = vault.getBucketReleased(2);
    expect(ecoCap).toEqual(ECOSYSTEM_CAP);
    expect(ecoReleased).toEqual(ton("100"));

    // Attempt to exceed Seed cap (bucket 0)
    val excessiveSeed = SEED_CAP + 1;
    val failCapRes = vault.sendReleaseReserveToAgent(
        controller.address,
        101,
        1000,
        user.address,
        excessiveSeed,
        1,
        0,
        { value: ton("0.1") },
    );
    expect(failCapRes).toHaveFailedTx({
        from: controller.address,
        to: vault.address,
        exitCode: Errors.CapExceeded,
    });
}
