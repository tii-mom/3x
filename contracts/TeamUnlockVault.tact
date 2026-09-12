import "@stdlib/deploy";

message AttestRoundUnlock {
    round: Int as uint8;
    active_agents: Int as uint32;
    external_revenue_usd: Int as coins;
    burn_parity_factor: Int as uint16; // Basis points (e.g. 5000 = 50%)
}

message ClaimVestedTokens {
    beneficiary: Address;
}

contract TeamUnlockVault with Deployable {
    owner: Address;
    team_allocation: Int as coins; // 10% total supply
    vested_amount: Int as coins;
    claimed_amount: Int as coins;
    oracle_pubkey: Int as uint256;
    completed_rounds: map<Int as uint8, Bool>;

    init(owner: Address, team_allocation: Int as coins, oracle_pubkey: Int as uint256) {
        self.owner = owner;
        self.team_allocation = team_allocation;
        self.vested_amount = 0;
        self.claimed_amount = 0;
        self.oracle_pubkey = oracle_pubkey;
    }

    receive(msg: AttestRoundUnlock) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can submit attestation");
        require(self.completed_rounds.get(msg.round) == null, "Round already unlocked");
        
        // Ensure network KPI gates are satisfied (Active Agents > 1000, External Revenue > $50,000)
        require(msg.active_agents >= 1000, "Active agents KPI not reached");
        require(msg.external_revenue_usd >= 50000, "External revenue KPI not reached");

        self.completed_rounds.set(msg.round, true);
        
        // Unlock next tranche (e.g. 20% of team allocation adjusted by burn parity)
        let tranche: Int = (self.team_allocation * 2000) / 10000;
        let adjustedTranche: Int = (tranche * msg.burn_parity_factor) / 10000;
        self.vested_amount = self.vested_amount + adjustedTranche;
    }

    receive(msg: ClaimVestedTokens) {
        let available: Int = self.vested_amount - self.claimed_amount;
        require(available > 0, "No tokens available to claim");
        self.claimed_amount = self.claimed_amount + available;

        send(SendParameters{
            to: msg.beneficiary,
            value: available,
            mode: SendIgnoreErrors,
            body: "Team Vesting Tranche Claimed".asComment()
        });
    }

    get fun get_vesting_data(): TeamVestingData {
        return TeamVestingData{
            total_allocation: self.team_allocation,
            vested: self.vested_amount,
            claimed: self.claimed_amount
        };
    }
}

struct TeamVestingData {
    total_allocation: Int as coins;
    vested: Int as coins;
    claimed: Int as coins;
}
