import "@stdlib/deploy";

message Mint {
    amount: Int as coins;
    receiver: Address;
}

message TokenBurn {
    amount: Int as coins;
    response_destination: Address;
}

contract ThreeXJetton with Deployable {
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;

    init(owner: Address, content: Cell) {
        self.total_supply = 0;
        self.owner = owner;
        self.content = content;
        self.mintable = true;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can mint");
        require(self.mintable, "Token is not mintable");
        self.total_supply = self.total_supply + msg.amount;
        
        // Transfer to receiver
        send(SendParameters{
            to: msg.receiver,
            value: 0,
            mode: SendRemainingValue,
            body: "3X Minted".asComment()
        });
    }

    receive("StopMint") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can stop mint");
        self.mintable = false;
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{
            total_supply: self.total_supply,
            mintable: self.mintable,
            admin_address: self.owner,
            jetton_content: self.content,
            jetton_wallet_code: myAddress().asSlice().asCell()
        };
    }
}

struct JettonData {
    total_supply: Int as coins;
    mintable: Bool;
    admin_address: Address;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
}
