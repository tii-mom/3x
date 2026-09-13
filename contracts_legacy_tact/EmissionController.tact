import "@stdlib/deploy";

message RegisterPrimaryAI {
    agent_id: Int as uint256;
    owner_address: Address;
}

message ClaimGrowthStage {
    agent_id: Int as uint256;
    stage: Int as uint8; // 1 = 3X, 2 = 9X, 3 = 27X, 4 = 81X, 5 = 243X
    amount: Int as coins;
    nonce: Int as uint64;
    signature: Slice;
}

contract EmissionController with Deployable {
    owner: Address;
    reserve_vault: Address;
    attestation_signer_pubkey: Int as uint256;
    registered_agents_count: Int as uint32;
    used_nonces: map<Int as uint64, Bool>;
    claimed_stages: map<Int as uint256, Bool>; // hash(agent_id, stage) -> claimed
    is_paused: Bool;

    init(owner: Address, reserve_vault: Address, signer_pubkey: Int as uint256) {
        self.owner = owner;
        self.reserve_vault = reserve_vault;
        self.attestation_signer_pubkey = signer_pubkey;
        self.registered_agents_count = 0;
        self.is_paused = false;
    }

    receive(msg: RegisterPrimaryAI) {
        require(!self.is_paused, "Controller paused");
        self.registered_agents_count = self.registered_agents_count + 1;
        // Max 255,000 subsidized agents across G0..G7
        require(self.registered_agents_count <= 255000, "Subsidized generation capacity exhausted");
    }

    receive(msg: ClaimGrowthStage) {
        require(!self.is_paused, "Controller paused");
        require(msg.stage >= 1 && msg.stage <= 5, "Invalid growth stage");

        // Replay Protection 1: Nonce check
        require(self.used_nonces.get(msg.nonce) == null, "Nonce already used");
        self.used_nonces.set(msg.nonce, true);

        // Replay Protection 2: Agent + Stage duplicate claim check
        let claimKey: Int = msg.agent_id + msg.stage;
        require(self.claimed_stages.get(claimKey) == null, "Stage already claimed for agent");
        self.claimed_stages.set(claimKey, true);

        let ctx: Context = context();

        // Release funds from AIReserveVault to user
        send(SendParameters{
            to: self.reserve_vault,
            value: 0,
            mode: SendRemainingValue,
            body: beginCell()
                .storeUint(0x12345678, 32) // Opcode for ReleaseToAgent
                .storeUint(msg.agent_id, 256)
                .storeAddress(ctx.sender)
                .storeCoins(msg.amount)
                .storeUint(msg.stage, 8)
                .endCell()
        });
    }

    get fun get_generation_info(): GenerationInfo {
        let count: Int = self.registered_agents_count;
        let gen: Int = 0;
        if (count > 1000) { gen = 1; }
        if (count > 3000) { gen = 2; }
        if (count > 7000) { gen = 3; }
        if (count > 15000) { gen = 4; }
        if (count > 31000) { gen = 5; }
        if (count > 63000) { gen = 6; }
        if (count > 127000) { gen = 7; }

        return GenerationInfo{
            total_registered: count,
            current_generation: gen,
            is_paused: self.is_paused
        };
    }
}

struct GenerationInfo {
    total_registered: Int as uint32;
    current_generation: Int as uint8;
    is_paused: Bool;
}
