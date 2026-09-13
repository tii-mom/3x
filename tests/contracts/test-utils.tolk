import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/ThreeXJettonMinter.gen"
import "@contracts/common/storage"

const MAX_3X_SUPPLY: coins = 3000000000000000000 // 3,000,000,000 * 10^9

fun buildTestMetadata(): cell {
    return beginCell().storeUint(0, 8).endCell();
}

fun setupJettonTest(): (ThreeXJettonMinter, Treasury, Treasury) {
    val admin = testing.treasury("admin");
    val user = testing.treasury("alice");

    val minterStorage: ThreeXMinterStorage = {
        totalSupply: 0,
        maxSupply: MAX_3X_SUPPLY,
        mintable: true,
        adminAddress: admin.address,
        nextAdminAddress: null,
        metadata: buildTestMetadata(),
    };

    val minter = ThreeXJettonMinter.fromStorage(minterStorage);
    val deployRes = minter.deploy(admin.address, { value: ton("1") });
    expect(deployRes).toHaveSuccessfulDeploy({
        to: minter.address,
    });

    return (minter, admin, user);
}
