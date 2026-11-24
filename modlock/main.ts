import { command, onFrame, findEntities, onStart, addBot, players, entityName, entityPosition, writeField, after, onWorld, precache, hideHud, createEntity, Vector, vector, handoff, handedOff } from 'modlock'
import { CPointClientUIWorldPanel } from "modlock/entities";
import { heroes } from 'modlock';
import {drawHud} from "./hud";
import { GameMode } from './GameMode';
import { applyArgs, describeFlags, flag, FROM_COMMAND, setFlag } from './flags';

import "../src/common/common";
const { TilesObj } = globalThis.MonopolisCommon;

// Flags come from `modlock dev --arg ...` (see flags.ts). /flag overrides made at runtime
// are carried across hot reloads with handoff().
let flagOverrides: string[] = [];
onStart((args) => {
  console.log("onStart args:", args);
  applyArgs(args);
  const handed = handedOff();
  if (handed) {
    flagOverrides = JSON.parse(handed) as string[];
    for (const a of flagOverrides) setFlag(a, FROM_COMMAND); // same protection as /flag: never turns tools off
    console.log(`flags after reload overrides: ${describeFlags()}`);
  }
});


onStart(() => {
    precache({
        resources: [
            "particles/{addon}/dest-ring.vpcf",
            "particles/{addon}/go-square.vpcf",
            "models/buildings_background/background_building01a.vmdl",
            "models/backdrop/buildings/backdrop_building_dock_hotel.vmdl"
        ]
    })
})


onWorld(() => {
  let entities = findEntities("point_clientui_world_panel")
  for (let entity of entities) {
    let name = entityName(entity) as Tiles;
    if (!name) continue;
    let worldpanel = new CPointClientUIWorldPanel(entity)
    let pos = entityPosition(entity)
    writeField(entity, "CBaseClientUIEntity", "m_DialogXMLName", "string", "file://{resources}/layout/{addon}/sinz_worldpanel.xml");
    if (TilesObj[name].type === "property") {
      worldpanel.inputAddCSSClass(TilesObj[name].category)
    }
  }

  const botCount = flag("bots");
  function ensureBots(attempt = 0) {
    const missing = botCount - players().filter(c => c.bot).length;
    for (let i = 0; i < missing; i++) {
      const hero = heroes[Math.floor(Math.random() * heroes.length)];
      addBot({ name: hero.title, team: 3, hero: hero.id, position: { x: 0, y: 0, z: 1 } });
    }
    if (players().filter(c => c.bot).length < botCount && attempt < 10) {
      after(0.5, () => ensureBots(attempt + 1)); // old bots still leaving, try again shortly
      return;
    }
    if (flag("autoStart")) {
      after(3, () => start());
    }
  }
  ensureBots(0);
})
onFrame(frame => {
    drawHud();
    if (frame.movement.length) {
        gamemode.OnMovement(frame.movement);
    }
    gamemode.OnFrame(frame);
});


let gamemode: GameMode = new GameMode();

command("monopolis_endturn", (player, args) => gamemode.EndTurn(player, args));
command("monopolis_requestdiceroll", (player, args) => gamemode.RollDice(player, args));
command("monopolis_requestpurchase", (player, args) => gamemode.PurchaseProperty(player, args));
command("monopolis_requestrenovation", (player, args) => gamemode.ApplyRenovation(player, args));
command("monopolis_requestpayrent", (player, args) => gamemode.PayRent(player, args));
command("monopolis_requestauction", (player, args) => gamemode.StartAuction(player, args));
command("monopolis_requestcard", (player, args) => gamemode.DrawCard(player, args));
command("monopolis_acknowledgecard", (player, args) => gamemode.AcknowledgeCard(player, args));
command("monopolis_auctionbid", (player, args) => gamemode.AuctionBid(player, args));
command("monopolis_auctionwithdraw", (player, args) => gamemode.AuctionWithdraw(player, args));
command("monopolis_requestbankrupt", (player, args) => gamemode.Bankrupt(player, args));
command("monopolis_requesttrade", (player, args) => gamemode.StartTrade(player, args));
command("monopolis_trade", (player, args) => gamemode.TradeEvent(player, args));

function start() {
  for (let actor of players()) {
      hideHud(actor.player, ["abilities", "ammo", "levelUp", "minimap", "ownHealth", "souls", "topBar", "stats", "status", "inventory", 'crosshair', 'brokerCountdown', ]);
      actor.player.freeCamera({x: 325, y: -875, z: 500}, {pitch: 45, yaw: 90, roll: 0})
  }
  gamemode = new GameMode();
  gamemode.StartGame();
}

// /flag              -> list flags that differ from defaults
// /flag name[=value] -> set one (or a preset); only works while the tools flag is on
// /flag no-<name>    -> turn a flag off, or the flags a preset sets itself (no-auction)
// /flag can never turn tools off; relaunch without it in --arg for that.
command("flag", (player, args) => {
  if (!flag("tools")) return;
  if (args === "") { player.chat(`flags: ${describeFlags()}`); return; }
  const { error, notes } = setFlag(args, FROM_COMMAND);
  if (error) { player.chat(error); return; }
  flagOverrides.push(args);
  handoff(JSON.stringify(flagOverrides));
  for (const note of notes) player.chat(note);
  player.chat(`flags: ${describeFlags()}`);
});

command('start', (player) => {
  player.chat('Hello from monopolis-deadlock!!');
  start();
});

