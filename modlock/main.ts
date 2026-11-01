import { command, onFrame, createEntity, findEntities, fireInput, modifierState, Buttons, onStart, setFreeForAll, readField, vector, Puppet, addBot, players, Cast, entityName, entityPosition, writeField, after, onWorld, precache } from 'modlock'
import { CPointClientUIWorldPanel } from "modlock/entities";
import { heroes } from 'modlock';

import {drawHud} from "./hud";

import "../src/common/common";
import { GameMode } from './GameMode';

// The shared file is a Panorama script, not an ES module with named exports.
const { TilesObj } = globalThis.MonopolisCommon;

onStart(() => {
    precache({
        resources: [
            "particles/abilities/mirage/mirage_dreamweaver_drowsy_debuff_counter_ring_top.vpcf",
            "particles/modifiers/respawn_credit_buff_symbol.vpcf",
        ]
    })
})

let layoutPath = "";

onWorld(() => {
  let entities = findEntities("point_clientui_world_panel")
  for (let entity of entities) {
    let name = entityName(entity) as Tiles;
    if (!name) continue;
    let worldpanel = new CPointClientUIWorldPanel(entity)
    let pos = entityPosition(entity)
    writeField(entity, "CBaseClientUIEntity", "m_DialogXMLName", "string", "file://{resources}/layout/{addon}/sinz_worldpanel.xml")
    console.log(name, worldpanel.m_DialogXMLName, pos, "!")
    layoutPath = worldpanel.m_DialogXMLName!.slice(0, worldpanel.m_DialogXMLName?.lastIndexOf("/"));
    console.log(globalThis.MonopolisCommon, TilesObj);
    if (TilesObj[name].type === "property") {
      worldpanel.inputAddCSSClass(TilesObj[name].category)
    }
  }
})
onFrame(frame => {
    drawHud(layoutPath);
    if (frame.movement.length) {
        gamemode.OnMovement(frame.movement);
    }
})

let gamemode: GameMode = new GameMode();

command("monopolis_endturn", (player, args) => gamemode.EndTurn(player, args));
command("monopolis_requestdiceroll", (player, args) => gamemode.RollDice(player, args));
command("monopolis_requestpurchase", (player, args) => gamemode.PurchaseProperty(player, args));
//command("monopolis_requestrenovation", (player, args) => gamemode.ApplyRenovation(player, args));
command("monopolis_requestpayrent", (player, args) => gamemode.PayRent(player, args));
command("monopolis_requestauction", (player, args) => gamemode.StartAuction(player, args));
command("monopolis_requestcard", (player, args) => gamemode.DrawCard(player, args));
command("monopolis_acknowledgecard", (player, args) => gamemode.AcknowledgeCard(player, args));
//command("monopolis_auctionbid", (player, args) => gamemode.AuctionBid(player, args));
command("monopolis_auctionwithdraw", (player, args) => gamemode.AuctionWithdraw(player, args));
command("monopolis_requestbankrupt", (player, args) => gamemode.Bankrupt(player, args));
command("monopolis_requesttrade", (player, args) => gamemode.StartTrade(player, args));
//command("monopolis_trade", (player, args) => gamemode.TradeEvent(player, args));

command('start', (player) => {
  player.chat('Hello from monopolis-deadlock!')

  for (let i of Array(5)) {
    let randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    addBot({
      name: randomHero.name,
      team: 3,
      hero: randomHero.id,
      position: {x: -3250, y: -350, z: 1}
    })
  }
  after(1, () => {
    for (let actor of players()) {
        actor.player.freeCamera({x: -3200, y: -400, z: 100}, {pitch: 0, yaw: 180, roll: 0})
    }
    gamemode = new GameMode();
    gamemode.StartGame();
  })
})

