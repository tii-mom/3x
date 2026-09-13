type ForwardPayloadRemainder = RemainingBitsAndRefs

struct (0b0) PayloadInline {
    value: RemainingBitsAndRefs
}

struct (0b1) PayloadInRef {
    value: Cell<RemainingBitsAndRefs>
}

struct (0x0f8a7ea5) AskToTransfer {
    queryId: uint64
    jettonAmount: coins
    transferRecipient: address
    sendExcessesTo: address?
    customPayload: cell?
    forwardTonAmount: coins
    @abi.clientType(PayloadInline | PayloadInRef)
    forwardPayload: ForwardPayloadRemainder
}

struct (0x7362d09c) TransferNotificationForRecipient {
    queryId: uint64
    jettonAmount: coins
    transferInitiator: address?
    @abi.clientType(PayloadInline | PayloadInRef)
    forwardPayload: ForwardPayloadRemainder
}

struct (0x178d4519) InternalTransferStep {
    queryId: uint64
    jettonAmount: coins
    transferInitiator: address?
    sendExcessesTo: address?
    forwardTonAmount: coins
    @abi.clientType(PayloadInline | PayloadInRef)
    forwardPayload: ForwardPayloadRemainder
}

struct (0xd53276db) ReturnExcessesBack {
    queryId: uint64
}

struct (0x595f07bc) AskToBurn {
    queryId: uint64
    jettonAmount: coins
    sendExcessesTo: address?
    customPayload: cell?
}

struct (0x7bdd97de) BurnNotificationForMinter {
    queryId: uint64
    jettonAmount: coins
    burnInitiator: address
    sendExcessesTo: address?
}

struct (0x2c76b973) RequestWalletAddress {
    queryId: uint64
    ownerAddress: address
    includeOwnerAddress: bool
}

struct (0xd1735400) ResponseWalletAddress {
    queryId: uint64
    jettonWalletAddress: address?
    ownerAddress: Cell<address>?
}

struct (0x642b7d07) MintNewJettons {
    queryId: uint64
    mintRecipient: address
    tonAmount: coins
    internalTransferMsg: Cell<InternalTransferStep>
}

struct (0x6501f354) ChangeMinterAdmin {
    queryId: uint64
    newAdminAddress: address
}

struct (0xfb88e119) ClaimMinterAdmin {
    queryId: uint64
}

struct (0x7431f221) DropMinterAdmin {
    queryId: uint64
}

struct (0x2508d66a) UpgradeMinterCode {
    queryId: uint64
    newData: cell
    newCode: cell
}

struct (0xcb862902) ChangeMinterMetadata {
    queryId: uint64
    newMetadata: cell
}

struct (0xd372158c) TopUpTons {}

fun ForwardPayloadRemainder.checkIsCorrectTlbEither(self) {
    var mutableCopy = self;
    if (mutableCopy.loadMaybeRef() != null) {
        mutableCopy.assertEnd();
    }
}

// -------------------------------------------------------------
// AI Reserve Vault Messages
// -------------------------------------------------------------

struct (0x8a100001) SetEmissionController {
    queryId: uint64
    controller: address
}

struct (0x8a100002) SetVaultJettonWallet {
    queryId: uint64
    jettonWallet: address
}

struct (0x8a100003) ReleaseReserveToAgent {
    queryId: uint64
    agentId: uint256
    recipient: address
    amount: coins
    stage: uint8
    bucketId: uint8 // 0 = Seed, 1 = Compute, 2 = Ecosystem
}

struct (0x8a100004) PauseReserveVault {
    queryId: uint64
}

struct (0x8a100005) UnpauseReserveVault {
    queryId: uint64
}

// -------------------------------------------------------------
// Emission Controller Messages
// -------------------------------------------------------------

struct (0x8b100001) RegisterPrimaryAi {
    queryId: uint64
    agentId: uint256
    ownerAddress: address
    nonce: uint64
    expiry: uint64
    paramVersion: uint32
    signature: Cell<bits512>
}

struct (0x8b100002) ClaimGrowthStage {
    queryId: uint64
    agentId: uint256
    ownerAddress: address
    stage: uint8
    nonce: uint64
    expiry: uint64
    paramVersion: uint32
    signature: Cell<bits512>
}

struct (0x8b100003) PauseEmissionController {
    queryId: uint64
}

struct (0x8b100004) UnpauseEmissionController {
    queryId: uint64
}

struct (0x8b100005) SetOraclePublicKey {
    queryId: uint64
    newPublicKey: uint256
}

// -------------------------------------------------------------
// Team Unlock Vault Messages
// -------------------------------------------------------------

struct (0x8c100001) AttestTeamRound {
    queryId: uint64
    round: uint8
    activeAgents: uint32
    externalRevenueUsd: coins
    burnParityBps: uint16
    nonce: uint64
    expiry: uint64
    signature: Cell<bits512>
}

struct (0x8c100002) ClaimTeamTokens {
    queryId: uint64
}

struct (0x8c100003) SetTeamVaultJettonWallet {
    queryId: uint64
    jettonWallet: address
}

struct (0x8c100004) PauseTeamVault {
    queryId: uint64
}

struct (0x8c100005) UnpauseTeamVault {
    queryId: uint64
}
