import { players, route, show } from "modlock";
import CustomNetTables from "./CustomNetTables";

export function drawHud() {
    for (const connection of players()) {
        route(connection.player, "current_turn", CustomNetTables.state?.misc?.current_turn);
        route(connection.player, "ui_state", CustomNetTables.state?.misc?.ui_state);
        route(connection.player, "auction", CustomNetTables.state?.misc?.auction);
        route(connection.player, "trade", CustomNetTables.state?.misc?.trade);
        route(connection.player, "price_definition", CustomNetTables.state?.misc?.price_definition);
        
        route(connection.player, "property_ownership", CustomNetTables.state?.property_ownership);
        route(connection.player, "player_state", CustomNetTables.state.player_state && Object.fromEntries(
            Object.entries(CustomNetTables.state.player_state).map(([key, playerState]) => {
                // Copy the connection without runtime-only/non-JSON fields.
                const { player, steamId, ...connection } = playerState.connection;
                return [key, { ...playerState, connection, steamId: steamId.toString() }];
            })
        ));
        show(connection.player, <Hud />)
    }
}

function Hud() {
    return (
        <panel style={{width: "100%", height: "100%"}}>
            <layout src="hud.xml" />
        </panel>
    )
}