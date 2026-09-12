import "@stdlib/deploy";

message SetEmissionController {
    controller: Address;
}

message ReleaseToAgent {
    agent_id: Int as uint256;
    recipient: Address;
    amount: Int as coins;
    stage: Int as uint8;
}

contract AIReserveVault with Deployable {
    owner: Address;
    emission_controller: Address?;
    hard_cap: Int as coins; // Max 80% supply (e.g. 800,000,000 * 10^9)
    total_released: Int as coins;
    is_paused: Bool;

    init(owner: Address, hard_cap: Int as coins) {
        self.owner = owner;
        self.emission_controller = null;
        self.hard_cap = hard_cap;
        self.total_released = 0;
        self.is_paused = false;
    }

    receive(msg: SetEmissionController) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can set controller");
        self.emission_controller = msg.controller;
    }

    receive(msg: ReleaseToAgent) {
        let ctx: Context = context();
        require(!self.is_paused, "Vault is paused");
        require(self.emission_controller != null, "Controller not configured");
        require(ctx.sender == self.emission_controller!!, "Only EmissionController can release");
        require(self.total_released + msg.amount <= self.hard_cap, "AI Reserve hard cap exceeded");

        self.total_released = self.total_released + msg.amount;

        send(SendParameters{
            to: msg.recipient,
            value: msg.amount,
            mode: SendIgnoreErrors,
            body: "3X Growth Claim Release".asComment()
        });
    }

    receive("Pause") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can pause");
        self.is_paused = true;
    }

    receive("Unpause") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can unpause");
        self.is_paused = false;
    }

    get fun get_vault_data(): VaultData {
        return VaultData{
            hard_cap: self.hard_cap,
            total_released: self.total_released,
            is_paused: self.is_paused,
            controller: self.emission_controller
        };
    }
}

struct VaultData {
    hard_cap: Int as coins;
    total_released: Int as coins;
    is_paused: Bool;
    controller: Address?;
}
