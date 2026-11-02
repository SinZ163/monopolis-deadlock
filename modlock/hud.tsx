import { Connection, players, route, show } from "modlock";
import CustomNetTables from "./CustomNetTables";

export function drawHud(prefix: string) {
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
        show(connection.player, <Hud prefix={prefix} connection={connection} />)
    }
}

function diagnosticChunks(text: string): string[] {
    const chunks: string[] = [];
    let chunk = "";
    let bytes = 0;
    // The host limits node text to 1024 UTF-8 bytes, not JS characters.
    for (const character of text) {
        const point = character.codePointAt(0)!;
        const size = point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
        if (bytes + size > 1000) {
            chunks.push(chunk);
            // Leave room under the 512-node limit for containers and headings.
            if (chunks.length === 480) {
                chunks.push("[Diagnostic output truncated]");
                return chunks;
            }
            chunk = "";
            bytes = 0;
        }
        chunk += character;
        bytes += size;
    }
    if (chunk) chunks.push(chunk);
    return chunks;
}

function Hud(props: { connection: Connection, prefix: string}) {
    const netStat = {
        misc: CustomNetTables.state.misc && Object.fromEntries(
            Object.entries(CustomNetTables.state.misc).filter(([key,value]) => key !== "price_definition")
        ),
        player_state: CustomNetTables.state.player_state && Object.fromEntries(
            Object.entries(CustomNetTables.state.player_state).map(([key, playerState]) => {
                // Copy the connection without runtime-only/non-JSON fields.
                const { player, steamId, ...connection } = playerState.connection;
                return [key, { ...playerState, connection }];
            })
        )
    }
    return (
        <panel style={{width: "100%", height: "100%"}}>
            <layout src="hud.xml" />
            {/*<panel style={{ flow: "down", width: "100%", height: "80%", overflowY: "scroll" }}>
                <label>Hello {props.connection.name.slice(0, 128)}</label>
                {diagnosticChunks(JSON.stringify(netStat, undefined, 4)).map(chunk => (
                    <label style={{ width: "100%" }}>{chunk}</label>
                ))}
            </panel>*/}
        </panel>
    )
}