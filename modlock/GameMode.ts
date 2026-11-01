import { after, createParticle, entityPosition, findEntitiesByName, MovementSample, Player, players, Puppet, toast, Vector, vector, WorldObject } from "modlock";
import CustomNetTables, { PlayerState, PropertyOwnership } from "./CustomNetTables";
import LocalNetTables from "./LocalNetTables";

const DeepPrintTable = console.log;
const print = console.log;
function tostring(num: number) {
    return num.toFixed(0);
}
// TODO: Fix
function IsInToolsMode() {
    return true;
}

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

const CardDeck: Record<Deck, CardAction[]> = {
    "chance": [
        {type: "teleport", dest: "go", text: "card_adv_go"},
        {type: "teleport", dest: "red3", text: "card_adv"},
        {type: "teleport", dest: "magenta1", text: "card_adv"},
        {type: "teleport_category", dest: "utility", text: "card_adv_utility"},
        {type: "teleport_category", dest: "railroad", text: "card_adv_railroad"}, // intentionally repeated
        {type: "teleport_category", dest: "railroad", text: "card_adv_railroad"},
        {type: "money_gain", value: 50, text: "CHANCE_BankDividend"},
        //{type: "fuckjail", text: "card_fuckjail_text"},
        {type: "teleport_relative", value: -3, text: "card_adv_relative_back"},
        {type: "jail", text: "card_jail_text"},
        //{type: "repairs", house: 25, hotel: 100, text: "CHANCE_GeneralRepairs"},
        {type: "money_lose", value: 15, text: "CHANCE_Speeding"},
        {type: "teleport", dest: "railroad1", text: "card_adv_railroad1"},
        {type: "teleport", dest: "blue2", text: "card_adv_blue2"},
        {type: "money_lose_others", value: 50, text: "CHANCE_Chairman"},
        {type: "money_gain", value: 150, text: "CHANCE_BuildingLoan"},
    ],
    "communitychest": [
        {type: "teleport", dest: "go", text: "card_adv_go"},
        {type: "money_gain", value: 200, text: "COMMUNITYBREAST_BankError"},
        {type: "money_lose", value: 50, text: "COMMUNITYBREAST_Doctor"},
        {type: "money_gain", value: 50, text: "COMMUNITYBREAST_Stock"},
        //{type: "fuckjail", text: "card_fuckjail_text"},
        {type: "jail", text: "card_jail_text"},
        {type: "money_gain", value: 100, text: "COMMUNITYBREAST_HolidaySeason"},
        {type: "money_gain", value: 20, text: "COMMUNITYBREAST_Income"},
        //{type: "money_gain_others", value: 10, text: "COMMUNITYBREAST_Birthday"},
        {type: "money_gain", value: 100, text: "COMMUNITYBREAST_LifeInsurance"},
        {type: "money_lose", value: 50, text: "COMMUNITYBREAST_Hospital"},
        {type: "money_lose", value: 50, text: "COMMUNITYBREAST_School"},
        {type: "money_gain", value: 25, text: "COMMUNITYBREAST_Consultancy"},
        //{type: "repairs", house: 40, hotel: 115, text: "COMMUNITYBREAST_StreetRepairs"},
        {type: "money_gain", value: 10, text: "COMMUNITYBREAST_Beauty"},
        {type: "money_gain", value: 100, text: "COMMUNITYBREAST_Inherit"},
    ],
};

// The shared file is a Panorama script, not an ES module with named exports.
const { TilesObj } = globalThis.MonopolisCommon;

const TilesReverseLookup: Record<number,Tiles> = Object.fromEntries(Object.entries(TilesObj).map<[number, Tiles]>(val => [val[1].index, val[0] as Tiles]));

export class GameMode {
    OnMovement(movements: MovementSample[]) {
        let actor = this.activePuppet?.player;
        console.log("Movement for ", actor?.slot, movements);
        for (let movement of movements) {
            console.log(movement.player.slot, actor?.slot);
            if (movement.player.slot !== actor?.slot) continue;
            console.log(this.goPos, this.destPos, movement.position);
            if (this.goPos && vector.distance(movement.position, this.goPos) < 100) {
                this.FoundHeroForGold();
                this.goPos = undefined;
                this.goParticle?.remove();
                this.goParticle = undefined;
            } 
            if (this.destPos && vector.distance(movement.position, this.destPos) < 100) {
                this.FoundHero();
                this.destPos = undefined;
                this.destParticle?.remove();
                this.destParticle = undefined;
                actor.watchMovement(false);
            }
        }
    }
    private currentDecks: Record<"chance"|"communitychest", CardAction[]> = {
        chance: [...CardDeck.chance],
        communitychest: [...CardDeck.communitychest],
    }

    private propertyOwnership: LocalNetTables<"property_ownership">;
    private playerState: LocalNetTables<"player_state">;
    private miscState: LocalNetTables<"misc">;

    private destParticle: WorldObject|undefined;
    private goParticle: WorldObject | undefined;
    private goPos: Vector | undefined;
    private destPos: Vector | undefined;
    public activePuppet: Puppet | undefined;

    constructor() {
        this.propertyOwnership = new LocalNetTables("property_ownership");
        this.playerState = new LocalNetTables("player_state");
        this.miscState = new LocalNetTables("misc");
        /*
        CustomGameEventManager.RegisterListener("monopolis_endturn", (user, event) => this.EndTurn(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestdiceroll", (user, event) => this.RollDice(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestpurchase", (user, event) => this.PurchaseProperty(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestrenovation", (user, event) => this.ApplyRenovation(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestpayrent", (user, event) => this.PayRent(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestauction", (user, event) => this.StartAuction(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestcard", (user, event) => this.DrawCard(user, event));
        CustomGameEventManager.RegisterListener("monopolis_acknowledgecard", (user, event) => this.AcknowledgeCard(user, event));
        CustomGameEventManager.RegisterListener("monopolis_auctionbid", (user, event) => this.AuctionBid(user, event));
        CustomGameEventManager.RegisterListener("monopolis_auctionwithdraw", (user, event) => this.AuctionWithdraw(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requestbankrupt", (user, event) => this.Bankrupt(user, event));
        CustomGameEventManager.RegisterListener("monopolis_requesttrade", (user, event) => this.StartTrade(user, event));
        CustomGameEventManager.RegisterListener("monopolis_trade", (user, event) => this.TradeEvent(user, event));
        */
    }
    TradeEvent(event: MonopolisTradeEvent & {PlayerID: PlayerID}): void {
        DeepPrintTable(event);
        let uiState = CustomNetTables.GetTableValue("misc", "ui_state");
        DeepPrintTable(uiState);
        // TODO: restricted trade scenarios
        if (uiState.type !== "trade") return;
        let tradeState = this.miscState.GetValue("trade");
        let currentTrader = this.playerState.GetValue(tradeState.current.toFixed(0));
        let participantSet = new Set(tradeState.participants);
        if (tradeState.status === TradeStateStatus.ModifyTrade) {
            if (!IsInToolsMode() && event.PlayerID !== tradeState.current) {return;}
            if (event.type === "add_property") {
                let propertyState = this.propertyOwnership.GetValue(event.property);
                // Only allow it going from the intended owner
                if (event.from !== propertyState.owner) return;
                if (event.from === event.to) return;
                let fromPlayer = this.playerState.GetValue(event.from.toFixed(0));
                let toPlayer = this.playerState.GetValue(event.to.toFixed(0));
                if (!toPlayer.alive || !fromPlayer.alive) {
                    toast(currentTrader.connection.player, "#monpolis_trade_dead");
                    return;
                }
                if (propertyState.houseCount > 0) {
                    toast(currentTrader.connection.player, "#monopolis_trade_improvement");
                    return;
                }
                // don't duplicate
                if (tradeState.offers.find(offer => offer.type === "property" && offer.property === event.property)) {
                    toast(currentTrader.connection.player, "#monopolis_trade_inoffer");
                    return;
                }
                tradeState.offers.push({type: "property", from: event.from, to: event.to, property: event.property});
                participantSet.add(event.from);
                participantSet.add(event.to);
            } else if (event.type === "remove_property") {
                tradeState.offers = tradeState.offers.filter(offer => offer.type !== "property" || offer.property !== event.property);
                participantSet = new Set(tradeState.offers.flatMap(offer => [offer.from, offer.to]));
            } else if (event.type === "add_money") {
                let fromPlayer = this.playerState.GetValue(event.from.toFixed(0));
                if (event.from === event.to) return;
                let toPlayer = this.playerState.GetValue(event.to.toFixed(0));
                if (!toPlayer.alive || !fromPlayer.alive) {
                    toast(currentTrader.connection.player, "#monpolis_trade_dead");
                    return;
                }
                if (fromPlayer.money + (tradeState.deltaMoney[event.from] ?? 0) < event.money) {
                    toast(currentTrader.connection.player, "#monopolis_trade_broke");
                    return;
                };
                tradeState.offers.push({type: "money", from: event.from, to: event.to, money: event.money});
                participantSet.add(event.from);
                participantSet.add(event.to);
                tradeState.deltaMoney[event.from] = (tradeState.deltaMoney[event.from] ?? 0) - event.money;
                tradeState.deltaMoney[event.to] = (tradeState.deltaMoney[event.to] ?? 0) + event.money;
            } else if (event.type === "remove_money") {
                let moneyOfferId = tradeState.offers.findIndex(offer => offer.type === "money" && offer.from === event.from && offer.to === event.to && offer.money === event.money);
                if (moneyOfferId > -1) {
                    tradeState.offers.splice(moneyOfferId, 1);
                    participantSet = new Set(tradeState.offers.flatMap(offer => [offer.from, offer.to]));
                }
            } else if (event.type === "confirm") {
                if (participantSet.size === 0) {
                    toast(currentTrader.connection.player, "#monopolis_trade_noparticipant");
                    return;
                }
                tradeState.status = TradeStateStatus.Confirmation;
                tradeState.confirmations = {}
            } else if (event.type === "cancel") {
                CustomNetTables.SetTableValue("misc", "ui_state", {type: "n/a"});
            }
        } else if (tradeState.status === TradeStateStatus.Confirmation) {
            if (!IsInToolsMode() && tradeState.participants.indexOf(event.PlayerID) === -1) return;
            // Tools only hack to force all to be "true"
            if (IsInToolsMode() && event.type === "confirm") {
                for (let participant of participantSet) {
                    tradeState.confirmations[participant] = true;
                }
            } else if (event.type === "accept") {
                tradeState.confirmations[event.PlayerID] = true;
            }
            else if (event.type === "reject") {
                tradeState.confirmations[event.PlayerID] = false;
                after(3, () => {
                    CustomNetTables.SetTableValue("misc", "ui_state", {type: "n/a"});
                });
            }
            let isSuccess = true;
            for (let participant of participantSet) {
                if (!tradeState.confirmations[participant]) {
                    isSuccess = false;
                    break;
                }
            }
            if (isSuccess) {
                after(3, () => {
                    CustomNetTables.SetTableValue("misc", "ui_state", {type: "n/a"});
                    for (let offer of tradeState.offers) {
                        if (offer.type === "property") {
                            let propertyState = this.propertyOwnership.GetValue(offer.property);
                            propertyState.owner = offer.to;
                            this.propertyOwnership.SetValue(offer.property, propertyState);
                        } else if (offer.type === "money") {
                            let playerFromState = this.playerState.GetValue(offer.from.toFixed(0));
                            let playerToState = this.playerState.GetValue(offer.to.toFixed(0));
                            playerFromState.money -= offer.money;
                            playerToState.money += offer.money;
                            this.SavePlayer(playerFromState);
                            this.SavePlayer(playerToState);
                        }
                    }
                });
            }
        }
        
        tradeState.participants = [...participantSet];
        this.miscState.SetValue("trade", tradeState);
        DeepPrintTable(tradeState);
    }
    StartTrade(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        if (!IsInToolsMode() && player !== current.connection.player) {return;}
        // TODO: Handle the restricted trade scenarios
        if (current.turnState.type !== "endturn") return;

        let uiState = CustomNetTables.GetTableValue("misc", "ui_state");
        if (uiState.type === "n/a") {
            CustomNetTables.SetTableValue("misc", "ui_state", {type: "trade"});
            this.miscState.SetValue("trade", {initiator: current.pID, current: current.pID, participants: [], offers: [], status: TradeStateStatus.ModifyTrade, confirmations: {}, deltaMoney: {}});
        }
    }

    AdvanceAuctionTurn(auctionState: AuctionState) {
        let current = this.GetCurrentPlayerState();
        if (current.turnState.type !== "auction") return;
        let numRemaining = 0;
        for (let player of Object.values(auctionState.playerStates)) {
            if (player && !player.hasWithdrawn) {
                numRemaining++;
            }
        }
        if (numRemaining < 2) {
            print("All withdrawn");
            if (numRemaining === 0 && auctionState.current_owner === -1) {
                for (let {player} of players()) {
                    toast(player, "#monopolis_auction_failed");
                }
                CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
                return;
            } else if (auctionState.current_owner !== -1) {
                let bidder = this.playerState.GetValue(tostring(auctionState.current_owner));
                bidder.money -= auctionState.current_bid;
                let property = this.propertyOwnership.GetValue(current.turnState.property);
                property.owner = auctionState.current_owner;
                this.propertyOwnership.SetValue(current.turnState.property, property);
                this.SavePlayer(bidder);
                CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
                return;
            } else {
                // valid scenario, continue
            }
        }

        let rollOrder = CustomNetTables.GetTableValue("misc", "roll_order");
        do {
            let currentIndex = Object.values(rollOrder).find(pID => auctionState.current_bidder === pID);
            if (!currentIndex) { 
                throw "Can't find the index :(";
            }
            auctionState.current_bidder = rollOrder[tostring((currentIndex + 1) % Object.keys(rollOrder).length)];
        } while(auctionState.playerStates[auctionState.current_bidder]!.hasWithdrawn);
        CustomNetTables.SetTableValue("misc", "auction", auctionState);
    }
    AuctionWithdraw(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        DeepPrintTable(current);
        if (current.turnState.type !== "auction") return;
        let auctionState = CustomNetTables.GetTableValue("misc", "auction");
        DeepPrintTable(auctionState);
        const currentBidder = CustomNetTables.GetTableValue("player_state", auctionState.current_bidder.toFixed(0));
        if (!IsInToolsMode() && currentBidder.connection.player !== player) return;
        print("Lets play?");
        let playerState = auctionState.playerStates[auctionState.current_bidder];
        if (!playerState) {
            print("wtf?");
            return;
        }
        playerState.hasWithdrawn = true;

        this.AdvanceAuctionTurn(auctionState);
    }
    AuctionBid(event: { amount: 10 | 50 | 100; PlayerID: PlayerID; }): void {
        let current = this.GetCurrentPlayerState();
        if (current.turnState.type !== "auction") return;
        let auctionState = CustomNetTables.GetTableValue("misc", "auction");
        if (!IsInToolsMode() && auctionState.current_bidder !== event.PlayerID) return;
        let playerState = this.playerState.GetValue(tostring(auctionState.current_bidder));
        if ((event.amount + auctionState.current_bid) > playerState.money) {
            toast(playerState.connection.player, "#monopolis_auction_broke");
            return;
        }
        auctionState.historical_bids.push({
            amount: event.amount,
            pID: auctionState.current_bidder,
        });
        auctionState.current_bid += event.amount;
        auctionState.current_owner = auctionState.current_bidder;
        this.AdvanceAuctionTurn(auctionState);
    }
    AcknowledgeCard(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        if (!IsInToolsMode() && player !== current.connection.player) {return;}
        if (current.turnState.type === "auxroll_result") {
            if (current.money < current.turnState.value) {
                toast(current.connection.player, "#monopolis_broke");
                return;
            }
            current.money -= current.turnState.value;
            let propertyOwnership = this.propertyOwnership.GetValue(TilesReverseLookup[current.location] as PurchasableTiles);
            let owner = this.playerState.GetValue(tostring(propertyOwnership.owner));
            owner.money += current.turnState.value;
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
            this.SavePlayer(current);
            this.SavePlayer(owner);
            return;
        }
        if (current.turnState.type !== "card_result") {return;}
        let card = current.turnState.card;
        switch(card.type) {
            case "jail":
                this.GotoJail();
                return;
            case "money_gain":
                current.money += card.value;
                this.SavePlayer(current);
                break;
            case "money_gain_others":
                let playerCountGain = 0;
                for (let playerState of Object.values(this.playerState.GetAllValues())) {
                    if (playerState.pID === current.pID) continue;
                    if (!playerState.alive) { continue }
                    // TODO: Handle bankrupt scenario
                    playerState.money -= card.value;
                    this.SavePlayer(playerState);
                    playerCountGain++;
                }

                current.money += (card.value * playerCountGain);
                this.SavePlayer(current);
                break;
            case "money_lose":
                if (current.money < card.value) {
                    toast(current.connection.player, "#monopolis_broke");
                    return;
                }
                current.money -= card.value;
                this.SavePlayer(current);
                break;
            case "money_lose_others":
                let otherPlayers = [];
                for (let playerState of Object.values(this.playerState.GetAllValues())) {
                    if (playerState.pID === current.pID) continue;
                    if (playerState.alive) {
                        otherPlayers.push(playerState);
                    }
                }
                let cost = (card.value * otherPlayers.length);
                if (current.money < cost) {
                    toast(current.connection.player, "#monopolis_broke");
                    return;
                }
                current.money -= cost;
                for (let playerState of otherPlayers) {
                    playerState.money += card.value;
                    this.SavePlayer(playerState);
                }
                this.SavePlayer(current);
                break;
            case "repairs":
                print("Fuck repairs");
                break;
            case "teleport":
                this.MoveForwardToLocation(TilesObj[card.dest].index);
                return;
            case "teleport_category":
                let destinations = Object.values(TilesObj).filter(row => row.type === (card as TeleportCategoryCardAction).dest);
                destinations.sort((a,b) => a.index - b.index);
                let dest = destinations[0];
                for (let destination of destinations) {
                    if (current.location < destination.index) {
                        dest = destination;
                        break;
                    }
                }
                this.MoveForwardToLocation(dest.index);
                return;
            case "teleport_relative":
                if (card.value >= 0)
                    this.MoveForwardToLocation(current.location + card.value);
                else
                    this.MoveBackwardToLocation(current.location + card.value);
                return;
        }
        CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
    }
    DrawCard(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        if (!IsInToolsMode() && player !== current.connection.player) {return;}
        if (current.turnState.type !== "card_prompt") {return;}
        let card = this.currentDecks[current.turnState.deck].shift();
        if (!card)  {
            print("Why is the deck empty");
            return;
        }
        if (card.type !== "fuckjail") {
            this.currentDecks[current.turnState.deck].push(card);
        } else {
            // TODO: Work out how we are going to keep it
        }
        CustomNetTables.SetTableValue("misc", "current_turn", {type: "card_result", pID: current.pID, rolls: current.turnState.rolls, card, potentialBankrupt: -1});
    }
    ApplyRenovation(event: { property: PurchasableTiles; houseCount: number; PlayerID: PlayerID; }): void {
        let current = this.GetCurrentPlayerState();
        
        // TODO: Fix
        //if (!IsInToolsMode() && player !== current.connection.player) {return;}

        let tile = TilesObj[event.property] as (RailroadDefinition | UtilityDefinition | PropertyDefinition);
        let propertyState = this.propertyOwnership.GetValue(tile.id);

        // Asserts its ownable and if it is, its the current player
        if (propertyState?.owner !== current.pID) { return; }

        // only specific turn states are allowed here
        const validTurnStates = ["payrent", "endturn", "card_result", "auxroll_result"];
        if (!validTurnStates.includes(current.turnState.type)) return;
        if (current.turnState.type === "payrent") {
            // if you can afford it, you don't have access to property management
            if (current.money > current.turnState.price) return;
            // if you owe someone money and have access to property management, only sell, no buy
            if (event.houseCount > propertyState.houseCount) {
                toast(current.connection.player, "#monopolis_property_debt");
                return;
            }
        }
        if (current.turnState.type === "card_result") {
            if (current.turnState.card.type === "money_lose" || current.turnState.card.type === "money_lose_others") {
                // if you can afford it, you don't have access to property management
                let value = current.turnState.card.value;
                if (current.turnState.card.type === "money_lose_others") {
                    let otherPlayers = [];
                    for (let playerState of Object.values(this.playerState.GetAllValues())) {
                        if (playerState.pID === current.pID) continue;
                        if (playerState.alive) {
                            otherPlayers.push(playerState);
                        }
                    }
                    value = otherPlayers.length * value;
                }
                if (current.money > value) return;
                // if you owe someone money and have access to property management, only sell, no buy
                if (event.houseCount > propertyState.houseCount) {
                    toast(current.connection.player, "#monopolis_property_debt");
                    return;
                }
            } else { return; }
        }
        if (current.turnState.type === "auxroll_result") {
            // if you can afford it, you don't have access to property management
            if (current.money > current.turnState.value) return;
            // if you owe someone money and have access to property management, only sell, no buy
            if (event.houseCount > propertyState.houseCount) {
                toast(current.connection.player, "#monopolis_property_debt");
                return;
            }
        }

        let commonLogicUsed = false;
        if (propertyState.houseCount === 0 && event.houseCount === -1) {
            // 0 => -1, we are mortgaging
            current.money += tile.purchasePrice / 2;
            propertyState.houseCount = -1;
            commonLogicUsed = true;
        } else if (propertyState.houseCount === -1 && event.houseCount === 0) {
            // -1 => 0, we are unmortgaging and should take the money + 10% fee
            let cost = (tile.purchasePrice / 2) * 1.10;
            if (current.money < cost) {
                toast(current.connection.player, "#monopolis_property_broke");
                return;
            }
            current.money -= cost;
            propertyState.houseCount = 0;
            commonLogicUsed = true;
        }

        if (tile.type === "property") {
            let properties = Object.values(TilesObj).filter(row => row.type === "property" && row.category === (tile as PropertyDefinition).category) as PropertyDefinition[];
            let owners = properties.map(row => [row, this.propertyOwnership.GetValue(row.id)]) as [PropertyDefinition, PropertyOwnership][];
            let isMonopoly = true;
            let minHouseCount = Number.MAX_SAFE_INTEGER;
            let maxHouseCount = -1 * Number.MAX_SAFE_INTEGER;
            for (let owner of owners) {
                if (owner[1].owner !== propertyState.owner) {
                    isMonopoly = false;
                } else {
                    if (owner[1].houseCount < minHouseCount) {
                        minHouseCount = owner[1].houseCount;
                    }
                    if (owner[1].houseCount > maxHouseCount) {
                        maxHouseCount = owner[1].houseCount;
                    }
                }
            }
            let currentDelta = maxHouseCount - minHouseCount;
            if (currentDelta > 1) {
                print("Wait what, this is illegal.");
                return;
            }
            
            let delta = event.houseCount - propertyState.houseCount;
            // Bound houseCount to legal values
            if (event.houseCount > 5 || event.houseCount < -1) {
                print("Illegal");
                return;
            }
            // Only allow increments of 1 or -1, OR -5
            // TODO: Reconsider this when I allow "blueprint mode" property management
            if (Math.abs(delta) > 1 && delta !== -5) {
                print("Illegal");
                return;
            }
            if (currentDelta > 0 && (event.houseCount > maxHouseCount || event.houseCount < minHouseCount)) {
                toast(current.connection.player, "#monopolis_property_buildevenly");
                return;
            }
            // If you don't have the monopoly fuck off
            if (event.houseCount > 0 && !isMonopoly) {
                toast(current.connection.player, "#monopolis_property_needmonopoly");
                return;
            }
            let market = CustomNetTables.GetTableValue("misc", "housing_market");
            
            DeepPrintTable({propertyState, event, delta, market, tile});
            if (propertyState.houseCount === 0 && event.houseCount === -1) {
                current.money += tile.purchasePrice / 2;
                propertyState.houseCount = -1;
            } else if (propertyState.houseCount === -1 && event.houseCount === 0) {
                // -1 => 0, we are unmortgaging and should take the money + 10% fee
                let cost = (tile.purchasePrice / 2) * 1.10;
                if (current.money < cost) {
                    toast(current.connection.player, "#monopolis_property_broke");
                    return;
                }
                current.money -= cost;
                propertyState.houseCount = 0;
            }
            // If you want houses and aren't going to a hotel, needs to have houses in the market
            else if (event.houseCount != 5 && delta > 0 && market.houses < delta) {
                toast(current.connection.player, "#monopolis_property_marketcrash");
                return;
            }
            // If you want a hotel, need a hotel in the market
            if (event.houseCount === 5 && delta > 0 && market.hotels < 1) {
                toast(current.connection.player, "#monopolis_property_marketcrash");
                return;
            }
            // If you are only removing the hotel and replacing with 4 houses, 4 houses need to be in the market
            if (delta === -1 && propertyState.houseCount === 5 && market.houses < 4) {
                toast(current.connection.player, "#monopolis_property_marketcrash");
                return;
            }
            // if you want a house/hotel and are poor, go away
            if (delta > 0 && current.money < tile.housePrice) {
                toast(current.connection.player, "#monopolis_property_broke");
                return;
            }
            // Sell the hotel and not put houses back on
            if (delta === -5 && propertyState.houseCount === 5) {
                market.hotels -= 1;
                propertyState.houseCount = 0;
                current.money += (tile.housePrice / 2) * 5;
            }
            // Buy a hotel (hotels are on the market, delta must be 1 and can afford it)
            else if (event.houseCount === 5 && delta > 0) {
                propertyState.houseCount = 5;
                market.hotels -= 1;
                market.houses += 4;
                current.money -= tile.housePrice;
            }
            // Buy a house (cant be hotel, houses are on the market, delta must be 1 and can afford it)
            else if (event.houseCount > 0 && propertyState.houseCount !== -1 && delta > 0) {
                propertyState.houseCount += delta;
                market.houses -= delta;
                current.money -= tile.housePrice;
            }
            // Sell a house/hotel
            else if (delta < 0 && event.houseCount !== -1) {
                if (propertyState.houseCount === 5) {
                    market.houses -= (5 + delta);
                    market.hotels += 1;
                } else {
                    market.houses += delta;
                }
                propertyState.houseCount += delta;
                current.money += (tile.housePrice / 2) * Math.abs(delta);
            } else if (commonLogicUsed) {}
            // 0 => -1, we are mortgaging and need to grant money
            else {
                print("Wait how did it make it this far");
                return;
            }
            
            CustomNetTables.SetTableValue("misc", "housing_market", market);
        }
        
        this.propertyOwnership.SetValue(tile.id, propertyState);
        this.SavePlayer(current);
        print("Saving the market, current property and player?");
    }
    StartAuction(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        if (!IsInToolsMode() && player !== current.connection.player) {return;}
        if (current.turnState.type !== "unowned") {return;}

        CustomNetTables.SetTableValue("misc", "current_turn", {type: "auction", pID: current.pID, rolls: current.turnState.rolls, property: current.turnState.property});
        let playerStates: Partial<Record<PlayerID, AuctionPlayerState>> = {};
        let playerInfo = this.playerState.GetAllValues();
        for (let player of Object.values(playerInfo)) {
            playerStates[player.pID] = {hasWithdrawn: !player.alive}
        }
        CustomNetTables.SetTableValue("misc", "auction", {
            current_bid: 0,
            current_owner: -1,
            current_bidder: current.pID,
            historical_bids: [],
            playerStates,
        });
        return;
    }
    
    Bankrupt(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        if (!IsInToolsMode() && player !== current.connection.player) {return;}
        if (current.turnState.type !== "payrent" && current.turnState.type !== "card_result" && current.turnState.type !== "auxroll_result") {return;}
        if (current.turnState.type === "payrent") {
            if (current.money > current.turnState.price) return;
        }
        else if (current.turnState.type === "card_result") {
            if (current.turnState.card.type !== "money_lose" && current.turnState.card.type !== "money_lose_others") return;
            let value = current.turnState.card.value;
            if (current.turnState.card.type === "money_lose_others") {
                let otherPlayers = [];
                for (let playerState of Object.values(this.playerState.GetAllValues())) {
                    if (playerState.pID === current.pID) continue;
                    if (playerState.alive) {
                        otherPlayers.push(playerState);
                    }
                }
                value = value * otherPlayers.length;
            }
            if (current.money > value) return;
        } else {
            if (current.money > current.turnState.value) return;
        }
        // if you made it this far, you are genuinely broke, good job
        
        let uiState = CustomNetTables.GetTableValue("misc", "ui_state");
        if (uiState.type === "n/a") {
            CustomNetTables.SetTableValue("misc", "ui_state", {type: "bankrupt_confirm"});
            return;
        }
        if (uiState.type !== "bankrupt_confirm") return;
        // TODO: Fuck we actually need to bankrupt them now
        let propertyStates = this.propertyOwnership.GetAllValues();
        let modifiedProperties: Array<[string, PropertyOwnership]> = [];
        for (let [id, state] of Object.entries(propertyStates)) {
            if (state.owner === current.pID) {
                let propertyInfo = TilesObj[id as PurchasableTiles] as PropertyDefinition|RailroadDefinition|UtilityDefinition;
                if (propertyInfo.type === "property" && state.houseCount > 0) {
                    current.money += (propertyInfo.housePrice * state.houseCount)/2;
                }
                if (state.houseCount >= 0) {
                    current.money += propertyInfo.purchasePrice / 2;
                }
                // TODO: #pretty destruction of the board
                modifiedProperties.push([id, {
                    owner: current.turnState.potentialBankrupt,
                    houseCount: -1
                }]);
            }
        }
        // when it isn't the bank
        // TODO: free parking house rule
        // TODO: Auction all the shit
        if (current.turnState.potentialBankrupt !== -1) {
            let asshole = this.playerState.GetValue(tostring(current.turnState.potentialBankrupt));
            asshole.money += current.money;
            this.SavePlayer(asshole);
            //let assholePlayer = PlayerResource.GetPlayer(asshole.pID);
            //let assholeHero = assholePlayer?.GetAssignedHero();
            //hero?.Kill(undefined, assholeHero);
        } else {
            //hero?.Kill(undefined, undefined);
        }
        for (let [id, state] of modifiedProperties) {
            this.propertyOwnership.SetValue(id as PurchasableTiles, state);
        }
        current.money = 0;
        current.alive = false;
        this.SavePlayer(current);
        CustomNetTables.SetTableValue("misc", "ui_state", {type: "n/a"});
        // TODO: Make them not respawn / spectator stand
        //Timers.CreateTimer(() => hero?.SetUnitCanRespawn(false));
        this.NextTurn();
    }
    PayRent(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        print("Roll Dice", current.pID);
        DeepPrintTable(current);

        // Anti Cheat, its just this simple
        if (!IsInToolsMode() && player !== current.connection.player) {return;}

        let turnState = CustomNetTables.GetTableValue("misc", "current_turn");
        
        if (turnState.type === "jailed") {
            if (current.money < 50) {
                toast(current.connection.player, "#monopolis_broke");
                return;
            }
            current.money -= 50;
            this.SavePlayer(current);
            this.LeaveJail();
            current = this.GetCurrentPlayerState();
            if (turnState.preRolled) {
                let diceRoll = turnState.rolls.pop();
                if (!diceRoll) throw new Error("Why is there no dice roll?");
                CustomNetTables.SetTableValue("misc", "current_turn", {type: "diceroll", dice1: diceRoll.dice1, dice2: diceRoll.dice2, pID: current.pID, rolls: current.turnState.rolls});
                this.MoveForwardToLocation((current.location + diceRoll.dice1 + diceRoll.dice2) % 40);
            } else {
                this.StartTurn();
            }
            return;
        }

        // this event is only available in payrent state
        if (turnState.type !== "payrent") return;

        if (current.money < turnState.price) {
            toast(current.connection.player, "#monopolis_broke");
            return;
        }

        let tile = TilesObj[turnState.property];
        // need this check because it may be tax which has no owner
        if (this.IsPurchasableTile(tile)) {
            let propertyState = this.propertyOwnership.GetValue(tile.id);
            let owner = this.playerState.GetValue(tostring(propertyState.owner));
            owner.money += turnState.price;
            this.SavePlayer(owner);
        }
        current.money -= turnState.price;
        this.SavePlayer(current);
        CustomNetTables.SetTableValue("misc", "current_turn", {pID: current.pID, rolls: current.turnState.rolls, type: "endturn"});
    }
    PurchaseProperty(player: Player, args: string): void {
        let current = this.GetCurrentPlayerState();
        print("Roll Dice", current.pID);

        // Anti Cheat, its just this simple
        if (!IsInToolsMode() && player !== current.connection.player) {return;}

        let turnState = CustomNetTables.GetTableValue("misc", "current_turn");

        // this event is only available in payrent state
        if (turnState.type !== "unowned") return;

        let tile = TilesObj[turnState.property];
        let propertyState = this.propertyOwnership.GetValue(turnState.property);
        if (!this.IsPurchasableTile(tile)) return;

        if (current.money < tile.purchasePrice) {
            toast(current.connection.player, "#monopolis_broke");
            return;
        }
        current.money -= tile.purchasePrice;
        propertyState.owner = current.pID;
        this.SavePlayer(current);
        this.propertyOwnership.SetValue(tile.id, propertyState);
        CustomNetTables.SetTableValue("misc", "current_turn", {pID: current.pID, rolls: current.turnState.rolls, type: "endturn"});
    }

    public IsPurchasableTile(tile: SpaceDefinition): tile is PropertyDefinition | RailroadDefinition | UtilityDefinition {
        switch(tile.type) {
            case "property":
            case "railroad":
            case "utility":
                return true;
        }
        return false;
    }

    public StartGame(): void {
        print("Game starting!");
        CustomNetTables.SetTableValue("misc", "price_definition", TilesObj);
        CustomNetTables.SetTableValue("misc", "housing_market", {houses: 32, hotels: 12});
        CustomNetTables.SetTableValue("misc", "ui_state", {type: "n/a"});
        this.currentDecks = {
            chance: ShuffleArray([...CardDeck.chance]),
            communitychest: ShuffleArray([...CardDeck.communitychest]),
        }

        let go = findEntitiesByName("go")[0];
        if (!go) {
            print("Warning: GO isn't on the map, this will fail.");
            return;
        }

        for (let tile of Object.values(TilesObj)) {
            if (this.IsPurchasableTile(tile)) {
                this.propertyOwnership.SetValue(tile.id, {
                    houseCount: 0,
                    owner: -1,
                });
            }
        }
        CustomNetTables.SetTableValue("misc", "current_turn", {pID: 0, rolls: [], type: "transition"});
        
        // TODO: Do logic to determine roll order
        let rollOrder: Record<string, PlayerID> = {};
        for (let [index, connection] of Object.entries(players())) {
            const i = Number(index);
            rollOrder[i] = i;

            let hero = connection.player.pawn();

            if (hero) {
                connection.player.teleport(
                    vector.add(entityPosition(go)!.position, vector.at(180, i * 30 + 5, 0)),
                    {pitch: 0, yaw: 180, roll: 0}
                );
            } else {
                print("Why is there no hero?");
                print(connection, hero);
            }

            this.playerState.SetValue(tostring(i), {
                connection,
                pID: i,
                money: 1500,
                location: 0,
                jailed: 0,
                alive: true,
            });
        }
        CustomNetTables.SetTableValue("misc", "roll_order", rollOrder);
        this.StartTurn();
    }

    public GetCurrentPlayerState() {
        const turnState = CustomNetTables.GetTableValue("misc", "current_turn");
        const playerState = this.playerState.GetValue(tostring(turnState.pID));
        let out = {...playerState, turnState: {...turnState, rolls: turnState.rolls}};
        if (out.turnState.type === "jailed") {
            (out.turnState as any).preRolled = out.turnState.preRolled
        }
        return out as PlayerState & {turnState: TurnState};
    }

    public GetStartLocationOfTile(tileId: number) {
        let tile = findEntitiesByName(TilesReverseLookup[tileId])[0];
        if (!tile) {
            throw new Error("Tile not found");
        }
        let middleVector = vector.at(0, 0, 0);
        if (tileId < 10) {
            middleVector = vector.at(70, 100, 0);
        } else if (tileId < 20) {
            middleVector = vector.at(0, 0, 0);
        } else if (tileId < 30) {
            middleVector = vector.at(0, 0, 0);
        } else {
            middleVector = vector.at(0, 0, 0);
        }
        return vector.add(entityPosition(tile)!.position, middleVector);
    }
    public SavePlayer(player: PlayerState & {turnState?: TurnState}) {
        let newPlayer = {...player};
        delete newPlayer.turnState;
        this.playerState.SetValue(tostring(player.pID), player);
    }

    public GotoJail() {
        let current = this.GetCurrentPlayerState();

        current.connection.player.teleport(vector.at(0,0,500), {pitch: 0, yaw: 0, roll: 0});
        CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
        current.jailed = 3;
        current.location = -1;
        this.SavePlayer(current);
    }
    public LeaveJail() {
        let current = this.GetCurrentPlayerState();
        let pos = this.GetStartLocationOfTile(10);
        // TODO: Make teleport pretty
        current.connection.player.teleport(vector.add(pos, vector.at(0,0,500)), {pitch: 0, yaw: 0, roll: 0});
        current.jailed = 0;
        current.location = 10;
        this.SavePlayer(current);
    }

    public StartTurn(preRolled = false) {
        let current = this.GetCurrentPlayerState();
        print("Turn Start", current.pID);

        print(current.jailed);
        if (preRolled || current.jailed > 0) {
            let indicators: Partial<Record<Tiles, number>> = {};
            for (let i = 1; i <= 12; i++) {
                if (i % 2 === 1 && current.jailed > 1) continue;
                let indicatorSpot = (10 + i) % 40;
                indicators[TilesReverseLookup[indicatorSpot]] = i;
            }
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "jailed", pID: current.pID, rolls: current.turnState.rolls, indicators, preRolled});
        } else {
            let currentPos = current.connection.player.pawn()!.position;
            let currentAngles = current.connection.player.pawn()!.cameraAngles;
            let destPos = this.GetStartLocationOfTile(current.location);
            this.activePuppet = new Puppet(current.connection.player, {
                stepTicks: 64,
                x: [currentPos.x, destPos.x],
                y: [currentPos.y, destPos.y],
                z: [currentPos.z, destPos.z],
                // TODO: Track and correct for yaw
                yaw: [currentAngles.yaw, currentAngles.yaw],
            });
            this.activePuppet.play();
    
            let indicators: Partial<Record<Tiles, number>> = {};
            for (let i = 1; i <= 12; i++) {
                let indicatorSpot = (current.location + i) % 40;
                indicators[TilesReverseLookup[indicatorSpot]] = i;
            }
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "start", pID: current.pID, rolls: current.turnState.rolls, indicators});
        }
    }
    public RollDice(player: Player, args: string) {
        let current = this.GetCurrentPlayerState();
        print("Roll Dice", current.pID);
        DeepPrintTable(current);

        // Anti Cheat, its just this simple
        if (!IsInToolsMode() && player !== current.connection.player) {return;}

        let dice1 = 1 + Math.floor(Math.random() * 6);
        let dice2 = 1 + Math.floor(Math.random() * 6);
        //let dice1 = 4;
        //let dice2 = 3;
        if (current.turnState.type === "auxroll_prompt") {
            let propertyState = this.propertyOwnership.GetValue(TilesReverseLookup[current.location] as PurchasableTiles);
            // TODO: Make more generic
            let value = 10 * (dice1 + dice2);
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "auxroll_result", pID: current.pID, rolls: current.turnState.rolls, card: current.turnState.card, dice1, dice2, value, potentialBankrupt: propertyState.owner})
            return;
        }
        current.turnState.rolls = [...current.turnState.rolls, {dice1,dice2}];

        // We are in jail and did NOT get doubles :(
        if (current.jailed > 0 && dice1 !== dice2) {
            current.jailed--;
            this.SavePlayer(current);
            if (current.jailed === 0) {
                CustomNetTables.SetTableValue("misc", "current_turn", current.turnState);
                this.StartTurn(true);
            } else {
                CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
            }
            return;
        } else if (current.jailed > 0) {
            this.LeaveJail();
            let oldRolls = current.turnState.rolls;
            current = this.GetCurrentPlayerState();
            current.turnState.rolls = oldRolls;
            // cheesy logic to make sure its not treated as a double later on
            current.turnState.rolls.push({dice1: 1, dice2: -1});
        }
        let turnState: TurnState = {
            pID: current.pID,
            type: "diceroll",
            rolls: current.turnState.rolls,
            dice1,
            dice2,
        }
        CustomNetTables.SetTableValue("misc", "current_turn", turnState);

        if (dice1 === dice2 && turnState.rolls.length >= 3) {
            this.GotoJail();
            return;
        } else {
            let futureLocation = (current.location + dice1 + dice2) % 40;
            print(current.location, dice1, dice2, futureLocation);
            this.SavePlayer(current);
            this.MoveForwardToLocation(futureLocation);
        }
    }
    public MoveBackwardToLocation(futureLocation: number) {
        if (futureLocation < 0) {
            futureLocation = 40 + futureLocation;
        }
        return this.MoveForwardToLocation(futureLocation, true);
    }
    public MoveForwardToLocation(futureLocation: number, backwards = false) {
        let current = this.GetCurrentPlayerState();

        if (current.location > futureLocation && !backwards) {
            print("We are spawning go??");
            let pos = this.GetStartLocationOfTile(0);
            this.goPos = pos;
            this.goParticle = createParticle({
                resource: "particles/modifiers/respawn_credit_buff_symbol.vpcf",
                position: pos,
            })
        }

        let position = this.GetStartLocationOfTile(current.location);
        let positions = [];
        do {
            let futureSide = Math.floor(futureLocation / 10);
            let currentSide = Math.floor(current.location / 10);
            // when going backwards, we need to treat corners as the previous side, not same side
            if (backwards) {
                futureSide = Math.floor((futureLocation - 1) / 10); // 19 - 1 = 18 / 10 = 1
                currentSide = Math.floor((current.location - 1) / 10); // 21 - 1 = 20 / 10 = 2
            }

            let currentDelta = current.location % 10;
            if (backwards && currentDelta === 0) {
                currentDelta = 10;
            }
            let futureDelta = futureLocation % 10;

            let rowAmount: number;
            if (currentSide === futureSide) {
                // edge case where a teleport card makes you to something behind you on same side, do the lap around
                if (futureDelta < currentDelta && !backwards) {
                    rowAmount = 10 - currentDelta;
                } else {
                    rowAmount = futureDelta - currentDelta;
                }
            } else if (backwards) {
                    rowAmount = -currentDelta;
            } else {
                rowAmount = 10 - currentDelta;
            }

            DeepPrintTable({futureSide, currentSide, currentDelta, futureDelta, rowAmount});
            let sameSideVector: Vector;
            if (currentSide === 0) {
                sameSideVector = vector.at(rowAmount * -125, 0, 0);
            } else if (currentSide === 1) {
                sameSideVector = vector.at(0, rowAmount * 125, 0);
            } else if (currentSide === 2) {
                sameSideVector = vector.at(rowAmount * 125, 0, 0);
            } else {
                sameSideVector = vector.at(0, rowAmount * -125, 0);
            }
            position = vector.add(position, sameSideVector);
            positions.push(position);
            current.location = (current.location + rowAmount) % 40;
            print(current.location, futureLocation);
        } while (current.location !== futureLocation);
        if (this.activePuppet) {
            this.activePuppet.pause();
        }
        let currentPos = current.connection.player.pawn()!.position;
        let currentAngles = current.connection.player.pawn()!.cameraAngles;
        this.activePuppet = new Puppet(current.connection.player, {
            stepTicks: 64,
            x: [currentPos.x, ...positions.map(pos => pos.x)],
            y: [currentPos.y, ...positions.map(pos => pos.y)],
            z: [currentPos.z, ...positions.map(pos => pos.z)],
            // TODO: Track and correct for yaw
            yaw: [currentAngles.yaw, ...positions.map(() => currentAngles.yaw)],
        });
        console.log(this.activePuppet.track);
        this.activePuppet.play();
        this.SavePlayer(current);
        this.destPos = position;
        this.destParticle = createParticle({
            resource: "particles/abilities/mirage/mirage_dreamweaver_drowsy_debuff_counter_ring_top.vpcf",
            position,
        });
        current.connection.player.watchMovement(true);
    }
    public FoundHeroForGold() {
        let current = this.GetCurrentPlayerState();
        current.money += 200;
        //let hero = PlayerResource.GetPlayer(current.pID)?.GetAssignedHero();
        //hero?.HeroLevelUp(true);
        this.SavePlayer(current);
    }
    public FoundHero() {
        let current = this.GetCurrentPlayerState();
        let property = TilesReverseLookup[current.location];
        let tile = TilesObj[property];
        print("Found hero");
        DeepPrintTable(current);
        print(property);
        if (this.IsPurchasableTile(tile)) {
            let propertyState = this.propertyOwnership.GetValue(tile.id);
            DeepPrintTable(this.propertyOwnership);
            DeepPrintTable(propertyState);
            // Owned property that isn't current player and it isn't mortgaged (-1)
            if (propertyState.owner > -1 && propertyState.owner !== current.pID && propertyState.houseCount >= 0) {
                print("Well you need to pay up now");
                const price = this.CalculateRent(tile, current, propertyState);
                DeepPrintTable({price, current, a:Number.isNaN(price)});
                if (Number.isNaN(price) && current.turnState.type === "card_result") {
                    CustomNetTables.SetTableValue("misc", "current_turn", {pID: current.pID, type: "auxroll_prompt", rolls: current.turnState.rolls, card: current.turnState.card});
                } else {
                    CustomNetTables.SetTableValue("misc", "current_turn", {pID: current.pID, type: "payrent", rolls: current.turnState.rolls, property: tile.id, price, potentialBankrupt: propertyState.owner});
                }
            }
            else if (propertyState.owner === -1) {
                CustomNetTables.SetTableValue("misc", "current_turn", {pID: current.pID, type: "unowned", rolls: current.turnState.rolls, property: tile.id});
            } else {
                // owner exists but either current player owns it or its mortgaged. skip to endturn state
                CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
            }
        } else if (tile.type === "tax") {
            CustomNetTables.SetTableValue("misc", "current_turn", {pID: current.pID, type: "payrent", rolls: current.turnState.rolls, property: tile.id, price: tile.cost, potentialBankrupt: -1});
        } else if (tile.type === "card") {
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "card_prompt", pID: current.pID, rolls: current.turnState.rolls, deck: tile.deck});
        } else if (tile.id === "gotojail") {
            this.GotoJail();
        } else {
            this.SavePlayer(current);
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "endturn", pID: current.pID, rolls: current.turnState.rolls});
        }
    }

    public CalculateRent(tile: PropertyDefinition | UtilityDefinition | RailroadDefinition, current: PlayerState, propertyState: PropertyOwnership): number {
        DeepPrintTable({tile, current, propertyState});
        let turnState = CustomNetTables.GetTableValue("misc", "current_turn");
        if (propertyState.houseCount === -1) { 
            return 0;
        }
        if (tile.type === "property") {
            let properties = Object.values(TilesObj).filter(row => row.type === "property" && row.category === tile.category) as PropertyDefinition[];
            let owners = properties.map(row => [row, this.propertyOwnership.GetValue(row.id)]) as [PropertyDefinition, PropertyOwnership][];
            DeepPrintTable(owners);
            let isMonopoly = true;
            for (let owner of owners) {
                if (owner[1].owner !== propertyState.owner) {
                    print(owner);
                    isMonopoly = false;
                    break;
                }
            }
            print(isMonopoly);
            if (isMonopoly) {
                switch(propertyState.houseCount) {
                    case 5:
                        return tile.hotelPrice;
                    case 4:
                        return tile.house4Price;
                    case 3:
                        return tile.house3Price;
                    case 2:
                        return tile.house2Price;
                    case 1:
                        return tile.house1Price;
                    case 0:
                        return tile.rentPrice * 2;
                }
            }
            return tile.rentPrice;
        }
        else if (tile.type === "railroad") {
            let railroads = [
                this.propertyOwnership.GetValue("railroad1"),
                this.propertyOwnership.GetValue("railroad2"),
                this.propertyOwnership.GetValue("railroad3"),
                this.propertyOwnership.GetValue("railroad4")
            ];
            let ownedRailroads = railroads.filter(railroad => railroad.owner === propertyState.owner).length;
            let price = tile.prices[ownedRailroads - 1];
            if (turnState.type === "card_result" && turnState.card.type === "teleport_category") {
                return price * 2;
            }
            return price;
        } else {
            DeepPrintTable({turnState});
            if (turnState.type === "diceroll") {
                let diceSum = turnState.dice1 + turnState.dice2;
                let railroads = [
                    this.propertyOwnership.GetValue("utility1"),
                    this.propertyOwnership.GetValue("utility2"),
                ];
                let ownedUtilities = railroads.filter(railroad => railroad.owner === propertyState.owner).length;
                return tile.multipliers[ownedUtilities - 1] * diceSum;
            } else if (turnState.type === "card_result") {
                return NaN;
            } else {
                throw "wtf why is it not diceroll state";
            }
        }
    }

    public EndTurn(player: Player, args: string) {
        let current = this.GetCurrentPlayerState();
        print("End Turn", current.pID);

        // Anti Cheat, its just this simple
        if (!IsInToolsMode() && player !== current.connection.player) {return;}

        let endturn = true;
        if (current.jailed === 0 && current.turnState.rolls.length > 0 && current.turnState.rolls.length < 3) {
            let diceRolls = current.turnState.rolls[current.turnState.rolls.length - 1];
            if (diceRolls.dice1 === diceRolls.dice2) {
                print("End turn bypassed by doubles?");
                endturn = false;
            }
        }
        if (endturn) {
            if (current.jailed === 0) {
                
                let currentTile = findEntitiesByName(TilesReverseLookup[current.location])[0];
                if (!currentTile) {
                    print(`Unable to find entity for tile ${TilesReverseLookup[current.location]} on location ${current.location}`);
                    return;
                }
                let offsetVector: Vector;
                if (current.location < 10) {
                    offsetVector = vector.at(100, 100, 0);
                } else if (current.location < 20) {
                    offsetVector = vector.at(100, -100, 0);
                } else if (current.location < 30) {
                    offsetVector = vector.at(-100, -100, 0);
                } else {
                    offsetVector = vector.at(-100, 100, 0);
                }
                let currentPos = current.connection.player.pawn()!.position;
                let currentAngles = current.connection.player.pawn()!.cameraAngles;
                let destPos = vector.add(entityPosition(currentTile)!.position, offsetVector);
                // TODO: Gracefully cleanup without deleting bots
                if (this.activePuppet) {
                    this.activePuppet.pause();
                }
                this.activePuppet = new Puppet(current.connection.player, {
                    stepTicks: 64,
                    x: [currentPos.x, destPos.x],
                    y: [currentPos.y, destPos.y],
                    z: [currentPos.z, destPos.z],
                    // TODO: Track and correct for yaw
                    yaw: [currentAngles.yaw, currentAngles.yaw],
                });
                this.activePuppet.play();
            }
            this.NextTurn();
        } else {
            let indicators: Partial<Record<Tiles, number>> = {};
            print(TilesReverseLookup);
            DeepPrintTable(TilesReverseLookup);
            for (let i = 1; i <= 12; i++) {
                let indicatorSpot = (current.location + i) % 40;
                indicators[TilesReverseLookup[indicatorSpot]] = i;
            }
            CustomNetTables.SetTableValue("misc", "current_turn", {type: "start", pID: current.pID, rolls: current.turnState.rolls, indicators});
        }
    }
    public NextTurn() {
        let currentTurn = CustomNetTables.GetTableValue("misc", "current_turn");
        let rollOrder = CustomNetTables.GetTableValue("misc", "roll_order");
        console.log(rollOrder);
        let currentIndex = Object.values(rollOrder).find(pID => currentTurn.pID === pID);
        console.log(currentIndex);
        if (currentIndex == null) { 
            throw "Can't find the index :(";
        }
        let playerStates = Object.values(this.playerState.GetAllValues()).filter(player => player.alive);
        print("Have we won yet?", playerStates.length);
        if (playerStates.length === 1) {
            print("Win?");
            // TODO: Replace with custom postgame as dedi servers instantly turn off when a winner is announced
            //GameRules.SetGameWinner(PlayerResource.GetPlayer(playerStates[0].pID)!.GetTeam());
        }
        let nextIndex = currentIndex as number;
        let nextPlayer: PlayerState;
        do {
            nextIndex = (nextIndex + 1) % Object.keys(rollOrder).length;
            let pID = rollOrder[tostring(nextIndex)];
            nextPlayer = this.playerState.GetValue(tostring(pID));
            print(nextPlayer.pID, nextPlayer.alive);
        } while (!nextPlayer.alive);
        let savedTurn: TurnState = { pID: nextPlayer.pID, rolls: [], type: "transition"};
        DeepPrintTable(savedTurn);
        CustomNetTables.SetTableValue("misc", "current_turn", savedTurn);
        this.StartTurn();
    }
}

function ShuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}