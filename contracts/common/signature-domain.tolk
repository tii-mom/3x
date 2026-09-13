// Signature Domain Separation for 3X Protocol
// Protects against cross-network, cross-controller, and cross-message type replay attacks.

const DOMAIN_PREFIX_REGISTRATION: int = 0x3358_524547 // "3XREG"
const DOMAIN_PREFIX_GROWTH_CLAIM: int = 0x3358_434c4d // "3XCLM"
const DOMAIN_PREFIX_TEAM_UNLOCK: int = 0x3358_54454d // "3XTEM"

fun buildRegistrationHash(
    networkId: int,
    controllerAddress: address,
    agentId: int,
    ownerAddress: address,
    nonce: int,
    expiry: int,
    paramVersion: int,
): int {
    val tail = beginCell()
        .storeUint(nonce, 64)
        .storeUint(expiry, 64)
        .storeUint(paramVersion, 32)
        .endCell();

    return beginCell()
        .storeUint(DOMAIN_PREFIX_REGISTRATION, 48)
        .storeInt(networkId, 32)
        .storeAddress(controllerAddress)
        .storeUint(agentId, 256)
        .storeAddress(ownerAddress)
        .storeRef(tail)
        .endCell()
        .hash();
}

fun buildGrowthClaimHash(
    networkId: int,
    controllerAddress: address,
    agentId: int,
    ownerAddress: address,
    stage: int,
    nonce: int,
    expiry: int,
    paramVersion: int,
): int {
    val tail = beginCell()
        .storeUint(stage, 8)
        .storeUint(nonce, 64)
        .storeUint(expiry, 64)
        .storeUint(paramVersion, 32)
        .endCell();

    return beginCell()
        .storeUint(DOMAIN_PREFIX_GROWTH_CLAIM, 48)
        .storeInt(networkId, 32)
        .storeAddress(controllerAddress)
        .storeUint(agentId, 256)
        .storeAddress(ownerAddress)
        .storeRef(tail)
        .endCell()
        .hash();
}

fun buildTeamUnlockHash(
    networkId: int,
    vaultAddress: address,
    round: int,
    activeAgents: int,
    revenueUsd: int,
    burnParityBps: int,
    nonce: int,
    expiry: int,
): int {
    val tail = beginCell()
        .storeCoins(revenueUsd)
        .storeUint(burnParityBps, 16)
        .storeUint(nonce, 64)
        .storeUint(expiry, 64)
        .endCell();

    return beginCell()
        .storeUint(DOMAIN_PREFIX_TEAM_UNLOCK, 48)
        .storeInt(networkId, 32)
        .storeAddress(vaultAddress)
        .storeUint(round, 8)
        .storeUint(activeAgents, 32)
        .storeRef(tail)
        .endCell()
        .hash();
}
