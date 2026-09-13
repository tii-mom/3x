import "@stdlib/strings"

struct WalletStorage {
    jettonBalance: coins
    ownerAddress: address
    minterAddress: address
}

struct ThreeXMinterStorage {
    totalSupply: coins
    maxSupply: coins
    mintable: bool
    adminAddress: address?
    nextAdminAddress: address?
    metadata: cell
}

fun ThreeXMinterStorage.load(): ThreeXMinterStorage {
    return ThreeXMinterStorage.fromCell(contract.getData());
}

fun ThreeXMinterStorage.save(self) {
    contract.setData(self.toCell());
}

fun WalletStorage.load(): WalletStorage {
    return WalletStorage.fromCell(contract.getData());
}

fun WalletStorage.save(self) {
    contract.setData(self.toCell());
}

struct JettonWalletDataReply {
    jettonBalance: coins
    ownerAddress: address
    minterAddress: address
    jettonWalletCode: cell
}

struct JettonDataReply {
    totalSupply: int
    mintable: bool
    adminAddress: address?
    jettonContent: cell
    jettonWalletCode: cell
}

struct (0x00) OnchainMetadataReply {
    contentDict: map<uint256, string_prefixed0x>
}

struct AiReserveBucketCaps {
    seedCap: coins
    seedReleased: coins
    computeCap: coins
    computeReleased: coins
    ecosystemCap: coins
    ecosystemReleased: coins
}

struct AiReserveConfig {
    emissionController: address?
    jettonWallet: address?
}

struct AiReserveStorage {
    owner: address
    globalHardCap: coins
    totalReleased: coins
    totalReserved: coins
    isPaused: bool
    config: Cell<AiReserveConfig>
    buckets: Cell<AiReserveBucketCaps>
}

fun AiReserveStorage.load(): AiReserveStorage {
    return AiReserveStorage.fromCell(contract.getData());
}

fun AiReserveStorage.save(self) {
    contract.setData(self.toCell());
}

struct EmissionStorage {
    owner: address
    reserveVault: address
    oraclePublicKey: uint256
    networkId: int32
    registeredAgentsCount: uint32
    usedNonces: map<uint64, bool>
    claimedStages: map<uint256, uint32>
    isPaused: bool
}

fun EmissionStorage.load(): EmissionStorage {
    return EmissionStorage.fromCell(contract.getData());
}

fun EmissionStorage.save(self) {
    contract.setData(self.toCell());
}

struct TeamVaultConfig {
    beneficiary: address
    jettonWallet: address?
}

struct TeamVaultStorage {
    owner: address
    teamAllocation: coins
    vestedAmount: coins
    claimedAmount: coins
    oraclePublicKey: uint256
    networkId: int32
    unlockedRounds: map<uint8, bool>
    usedNonces: map<uint64, bool>
    isPaused: bool
    config: Cell<TeamVaultConfig>
}

fun TeamVaultStorage.load(): TeamVaultStorage {
    return TeamVaultStorage.fromCell(contract.getData());
}

fun TeamVaultStorage.save(self) {
    contract.setData(self.toCell());
}
