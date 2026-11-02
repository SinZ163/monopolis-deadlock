import { Connection } from "modlock";

export interface ServerPlayerState extends PlayerState {
    connection: Connection;
}

export interface CustomNetTableDeclarations {
    property_ownership: Record<PurchasableTiles, PropertyOwnership>,
    player_state: Record<string, ServerPlayerState>,
    misc: {
        current_turn: TurnState
        roll_order: Record<string, PlayerID>,
        housing_market: {
            houses: number,
            hotels: number,
        },
        price_definition: Record<Tiles,SpaceDefinition>,
        auction: AuctionState,
        trade: TradeState,
        ui_state: UIState
    }
}

class CustomNetTables {
    state: CustomNetTableDeclarations = {} as unknown as CustomNetTableDeclarations;
    GetTableValue<
        TName extends keyof CustomNetTableDeclarations,
        T extends CustomNetTableDeclarations[TName],
        K extends keyof T,
    >(
        tableName: TName,
        keyName: K,
    ): T[K] {
        console.log("Fetching ", tableName, keyName, " |state = ",this.state)
        let table = this.state[tableName] as T;
        return table[keyName];
    }
    SetTableValue<
        TName extends keyof CustomNetTableDeclarations,
        T extends CustomNetTableDeclarations[TName],
        K extends keyof T,
    >(
        tableName: TName,
        keyName: K,
        value: T[K],
    ): boolean {
        let table = this.state[tableName] as T;
        if (!table) {
            this.state[tableName] = {} as unknown as T;
            table = this.state[tableName] as T;
        }
        table[keyName] = value;
        return true;
    }

}

let instance = new CustomNetTables();
export default instance;