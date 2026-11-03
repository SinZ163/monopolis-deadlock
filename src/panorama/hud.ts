const MOVEMENT_SCHEDULE_TIMER = 0.1;

$.RegisterForUnhandledEvent("PlaySoundEffect", (sound:any) => {
    $.Msg("Unhandled Sound", sound);
    $.Msg("player", $.GetContextPanel().GetAttributeString("modlock_route_player_state", "default_player"));
    $.Msg("ui", $.GetContextPanel().GetAttributeString("modlock_route_ui_state", "default_ui"));
    $.Msg("current_turn", $.GetContextPanel().GetAttributeString("modlock_route_current_turn", "default_current_turn"));
});

(() => {
    for (let pID of Array(6).keys()) {
        let existingPanel = $(`#MoneyTable_${pID}`);
        if (!existingPanel) {
            $.Msg("MoneyTable for pID", pID, "deos not exist?");
            existingPanel = $.CreatePanel("Panel", $("#MoneyTable"), `MoneyTable_${pID}`);
            existingPanel.AddClass("Hidden");

            existingPanel.BLoadLayoutSnippet("MoneyTableRow");
            var propertyContainer = $.CreatePanel("Panel", existingPanel, `MoneyPropertyContainer_${pID}`);
            propertyContainer.AddClass("MoneyPropertyContainer");
        }
        let existingTradePanel = $(`#TradePlayerSlot_${pID}`);
        if (!existingTradePanel) {
            $.Msg("TradePlayerSlot for pID", pID, "does not exist?", );
            existingTradePanel = $.CreatePanel("Panel", $("#TradePlayerSlots"), `TradePlayerSlot_${pID}`);
            existingTradePanel.BLoadLayoutSnippet("TradePlayerSlotEntry");
            existingTradePanel.AddClass("Hidden");

            (existingTradePanel.FindChildTraverse("PlayerImage") as AvatarImage).steamid = "0";
            (existingTradePanel.FindChildTraverse("PlayerName") as UserName).steamid = "0";
            var propertyContainer = $.CreatePanel("Panel", existingTradePanel, `TradePropertyContainer_${pID}`);
            propertyContainer.AddClass("TradePropertyContainer");
            $.RegisterEventHandler("DragEnter", propertyContainer, OnTradePropertyDragEnter);
            $.RegisterEventHandler("DragLeave", propertyContainer, OnTradePropertyDragLeave);
            $.RegisterEventHandler("DragDrop", propertyContainer, OnTradePropertyDragDrop);
            (propertyContainer.Data() as any).pID = pID;
            var moneyContainer = existingTradePanel.FindChildTraverse("TransferMoney") as NumberEntry;
            $.RegisterEventHandler("DragStart", moneyContainer, OnTradeMoneyDragStart);
            $.RegisterEventHandler("DragEnd", moneyContainer, OnTradeMoneyDragEnd);
            (moneyContainer.Data() as any).pID = pID;
        }
    }
})();

Modlock.route("price_definition", (priceDefs) => {
    if (!priceDefs) return;
    let purchasabletiles = Object.entries(TilesObj).filter(([k,v]) => v.type === "property" || v.type === "railroad" || v.type === "utility") as Array<[PurchasableTiles, PropertyDefinition|RailroadDefinition|UtilityDefinition]>;
    for (let [tileStr, tileInfo] of purchasabletiles.sort((a,b) => (a[1].categoryId - b[1].categoryId) === 0 ? a[1].index - b[1].index : a[1].categoryId - b[1].categoryId)) {

        if (tileInfo.type !== "property" && tileInfo.type !== "railroad" && tileInfo.type !== "utility") {
            continue;
        }
        let tile = tileStr as PurchasableTiles;

        let panel = $.CreatePanel("Panel", $("#PropertyManagement"), `PropertyManagement_${tile}`);
        panel.BLoadLayoutSnippet("PropertyManagementRow");
        (panel.FindChildTraverse("PropertyName") as LabelPanel).text = locale[`tile_${tile}`];
        panel.FindChildTraverse("BuyHouse")?.SetPanelEvent("onactivate", () => AddHouse(tile));
        panel.FindChildTraverse("SellHouse")?.SetPanelEvent("onactivate", () => RemoveHouse(tile));
        let colourPanel = panel.FindChildTraverse("PropertyColour");
        if (!colourPanel) return;
        switch (tile) {
            case "brown1":
            case "brown2":
                colourPanel.AddClass("brown");
                break;
            case "teal1":
            case "teal2":
            case "teal3":
                colourPanel.AddClass("teal");
                break;
            case "magenta1":
            case "magenta2":
            case "magenta3":
                colourPanel.AddClass("magenta");
                break;
            case "orange1":
            case "orange2":
            case "orange3":
                colourPanel.AddClass("orange");
                break;
            case "red1":
            case "red2":
            case "red3":
                colourPanel.AddClass("red");
                break;
            case "yellow1":
            case "yellow2":
            case "yellow3":
                colourPanel.AddClass("yellow");
                break;
            case "green1":
            case "green2":
            case "green3":
                colourPanel.AddClass("green");
                break;
            case "blue1":
            case "blue2":
                colourPanel.AddClass("blue");
                break;
            case "railroad1":
            case "railroad2":
            case "railroad3":
            case "railroad4":
                colourPanel.AddClass("black");
                break;
            case "utility1":
            case "utility2":
                colourPanel.AddClass("white");
                break;
        }
        const playerStates = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_player_state", "{}")) as PanoramaPlayerState;
        for (let {pID} of Object.values(playerStates)) {
            let playerPropertyContainer = $(`#MoneyPropertyContainer_${pID}`);
            const categoryContainerId = `MoneyPropertyContainer_${pID}_${tileInfo.categoryId}`;
            let existingCategoryContainer = playerPropertyContainer.FindChildTraverse(categoryContainerId);
            if (!existingCategoryContainer) {
                existingCategoryContainer = $.CreatePanel("Panel", playerPropertyContainer, categoryContainerId);
                existingCategoryContainer.AddClass("MoneyPropertyCategoryContainer");
            }
            let propTile = $.CreatePanel("Panel", existingCategoryContainer, `MoneyProperty_${pID}_${tile}`);
            propTile.AddClass(`MoneyPropertyCategoryCell`);
            propTile.AddClass(tileInfo.type === "property" ? tileInfo.category : tileInfo.type);
            
            const categoryTradeContainerId = `TradePlayerSlot_${pID}_${tileInfo.categoryId}`;
            let tradePropertyContainer = $(`#TradePropertyContainer_${pID}`);
            let existingTradeCategoryContainer = tradePropertyContainer.FindChildTraverse(categoryTradeContainerId);
            if (!existingTradeCategoryContainer) {
                existingTradeCategoryContainer = $.CreatePanel("Panel", tradePropertyContainer, categoryTradeContainerId);
                existingTradeCategoryContainer.AddClass("TradePlayerSlotCategoryContainer");
            }
            let tradeTile = $.CreatePanel("Panel", existingTradeCategoryContainer, `TradeProperty_${pID}_${tile}`);
            tradeTile.SetDraggable(true);
            tradeTile.AddClass(`TradePropertyCategoryCell`);
            tradeTile.AddClass(tileInfo.type === "property" ? tileInfo.category : tileInfo.type);
            $.RegisterEventHandler("DragStart", tradeTile, OnTradePropertyDragStart);
            $.RegisterEventHandler("DragEnd", tradeTile, OnTradePropertyDragEnd);
            (tradeTile.Data() as any).category = tileInfo.type === "property" ? tileInfo.category : tileInfo.type;
            (tradeTile.Data() as any).tile = tile;
            (tradeTile.Data() as any).pID = pID;
            (existingTradeCategoryContainer.Data() as any).pID = pID;
        }
    }
});

Modlock.route("property_ownership", (ownership: Record<PurchasableTiles, PropertyOwnership>) => {
    if (!ownership) return;
    for (let [key, property] of Object.entries(ownership)) {
        OnPropertyChanged(key as PurchasableTiles, property);
    }
});

Modlock.route("auction", (auction: AuctionState) => {
    $.Msg("Auction| ", auction);
    if (!auction) return;
    //let currentPlayerColor = ColorToHexCode2(Players.GetPlayerColor(value.current_bidder));
    //$("#AuctionButtons").style.backgroundColor = `gradient ( linear, 0% 100%, 100% 0%, from( #00000000 ), to( ${currentPlayerColor} ) );`;
    ($("#AuctionButtons").style as any).backgroundColorOpacity = 1.0;
    //$("#AuctionButtons").style.backgroundColor = `gradient( radial, 50% 50%, 0% 0%, 20% 20%, from( #000000ff ), to( ${currentPlayerColor}ff ) );`;
    let historicalBidCount = $("#AuctionScreen").GetAttributeInt("historicalBids", 0);
    ($("#AuctionValueText") as LabelPanel).text = auction.current_bid.toFixed(0);
    let bids = auction.historical_bids;
    if (historicalBidCount > bids.length) {
        $("#BidHistory").RemoveAndDeleteChildren();
        historicalBidCount = 0;
    }

    // TODO: Show who is in vs withdrawn

    const playerStates = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_player_state", "{}")) as PanoramaPlayerState;
    for (let bidId = historicalBidCount; bidId < bids.length; bidId++) {
        let bid = bids[bidId];

        let bidPanel = $.CreatePanel("Panel", $("#BidHistory"), `Bid_${bidId}`);
        bidPanel.BLoadLayoutSnippet("AuctionBidHistoryRow");
        bidPanel.AddClass("Bid");
        //bidPanel.style.backgroundColor = ColorToHexCode2(Players.GetPlayerColor(bid.pID));
        $.Schedule(0, () => bidPanel.AddClass("Bid" + bid.amount));

        (bidPanel.FindChildTraverse("AuctionBidAvatar") as AvatarImage).steamid = playerStates[bid.pID].steamId;
        (bidPanel.FindChildTraverse("AuctionBidName") as UserName).steamid = playerStates[bid.pID].steamId;
        (bidPanel.FindChildTraverse("AuctionBidLabel") as LabelPanel).text = locale["monopolis_auction_bid" + bid.amount];
    }
    $("#AuctionScreen").SetAttributeInt("historicalBids", bids.length);
});

function OnPropertyChanged(tile: PurchasableTiles, value: PropertyOwnership) {
    let existingPanel = $(`#PropertyManagement_${tile}`);
    if (!existingPanel) {
        return;
    }

    // default to -2 so the -1's coming in from unowned cause the handler to run
    let currentOwner = existingPanel.GetAttributeInt("current_owner", -2);
    if (value.owner !== currentOwner) {
        existingPanel.RemoveClass(`Owner_${currentOwner}`);
        existingPanel.AddClass(`Owner_${value.owner}`);
        existingPanel.SetAttributeInt("current_owner", value.owner);
    }
    const playerStates = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_player_state", "{}")) as PanoramaPlayerState;
    for (let {pID} of Object.values(playerStates)) {
        let playerTile = $(`#MoneyProperty_${pID}_${tile}`);
        playerTile.SetHasClass("Unowned", value.owner === -1);
        playerTile.SetHasClass("Hotel", value.owner === pID && value.houseCount === 5);
        playerTile.SetHasClass("House", value.owner === pID && value.houseCount > 0 && value.houseCount < 5);
        playerTile.SetHasClass("Owner", value.owner === pID && value.houseCount === 0);
        playerTile.SetHasClass("Mortgaged", value.owner === pID && value.houseCount === -1);
        playerTile.SetHasClass("Owned", value.owner > -1 && value.owner !== pID);
        let tradeTile = $(`#TradeProperty_${pID}_${tile}`);
        tradeTile.SetHasClass("Unowned", value.owner === -1);
        tradeTile.SetHasClass("Hotel", value.owner === pID && value.houseCount === 5);
        tradeTile.SetHasClass("House", value.owner === pID && value.houseCount > 0 && value.houseCount < 5);
        tradeTile.SetHasClass("Owner", value.owner === pID && value.houseCount === 0);
        tradeTile.SetHasClass("Mortgaged", value.owner === pID && value.houseCount === -1);
        tradeTile.SetHasClass("Owned", value.owner > -1 && value.owner !== pID);
    }
    // TODO: Proper naming convention for houses / hotels
    // TODO: Block + and - buttons in correct conditions
    let text = "";
    switch (value.houseCount) {
        case 5: 
            text = "monopolis_propertymanagement_hotel";
            break;
        case 4:
        case 3:
        case 2:
        case 1:
            existingPanel.FindChildTraverse("PropertyStatus")?.SetDialogVariableInt("houseCount", value.houseCount);
            text = "monopolis_propertymanagement_houses";
            break;
        case 0:
            text = "monopolis_propertymanagement_owned"
            break;
        case -1:
            text = "monopolis_propertymanagement_mortgaged";
            break;
    }
    let propertyStatus = (existingPanel.FindChildTraverse("PropertyStatus") as LabelPanel);
    propertyStatus.text = locale[text];
}


Modlock.route("ui_state", (state: UIState) => {
    if (!state) return;
    let currentState = $.GetContextPanel().GetAttributeString("currentuistate", "undefined");
    $.Msg("UI Listener", currentState, state);
    if (currentState !== "undefined") {
        $.GetContextPanel().RemoveClass(currentState);
    }
    let type = "UI" + state.type.replace("/", "");
    $.GetContextPanel().AddClass(type);
    $.GetContextPanel().SetAttributeString("currentuistate", type);

});


Modlock.route("current_turn", (turnState: TurnState) => {
    $.Msg("CurrentTurn", turnState);
    if (!turnState) return;
    let currentState = $.GetContextPanel().GetAttributeString("currentstate", "undefined");
    $.Msg(currentState, "|", turnState.type);

    if (currentState !== "undefined") {
        $.GetContextPanel().RemoveClass(currentState);
    }
    
    $.GetContextPanel().AddClass(turnState.type);
    $.GetContextPanel().SetAttributeString("currentstate", turnState.type);

    let currentTurn = $.GetContextPanel().GetAttributeInt("currentturn", -1);
    if (turnState.pID !== currentTurn) {
        $.GetContextPanel().RemoveClass("JailDice");
        $.GetContextPanel().RemoveClass("SellStuffRequired");
        $.GetContextPanel().RemoveClass("JailPreRolled");
        $.GetContextPanel().RemoveClass(`Turn_${currentTurn}`);
        $.GetContextPanel().AddClass(`Turn_${turnState.pID}`);
        $.GetContextPanel().SetAttributeInt("currentturn", turnState.pID);
    }

    let diceRolls = turnState.rolls;
    let isDoubles = (diceRolls.length > 0 && diceRolls.length < 3 && diceRolls[diceRolls.length - 1].dice1 === diceRolls[diceRolls.length - 1].dice2);

    try {
        if (!isDoubles && (turnState.type === "endturn" || turnState.type === "unowned" || turnState.type === "payrent")) {
            $.Msg("Attempting to cancel movement due to turn being over");
            let movementSchedule = $.GetContextPanel().GetAttributeInt("movementSchedule", -1);
            if (movementSchedule > -1) {
                $.CancelScheduled(movementSchedule as ScheduleID);
            }
        }
    } catch {}

    if (turnState.type === "diceroll" || turnState.type === "auxroll_result") {
        ($("#dice1") as LabelPanel).text = turnState.dice1.toFixed(0);
        ($("#dice2") as LabelPanel).text = turnState.dice2.toFixed(0);
        if (isDoubles) {
            ($("#endturnLabel") as LabelPanel).text = locale["reroll"];
        } else {
            ($("#endturnLabel") as LabelPanel).text = locale["endturn"];
        }
    }
    const playerStates = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_player_state", "{}")) as PanoramaPlayerState;
    let playerState = playerStates[turnState.pID];

    switch(turnState.type) {
        case "start":
            let moneyContainer = $("#MoneyTable");
            if (moneyContainer.BHasClass("Hidden")) {
                for (let row of moneyContainer.Children()) {
                    let pID = row.id.split("_")[1];
                    //row.style.backgroundColor = ColorToHexCode2(Players.GetPlayerColor(Number.parseInt(pID) as PlayerID));
                }
                moneyContainer.RemoveClass("Hidden");
            }
            break;
        case "unowned":
            $("#buypropertyLabel").SetDialogVariable("property", locale[`tile_${turnState.property}`]);
            break;
        case "payrent":
            $("#payrentLabel").SetDialogVariableInt("price", turnState.price);
            if (turnState.price > playerState.money) {
                 $.GetContextPanel().AddClass("SellStuffRequired");
            }
            break;
        case "jailed":
            $("#payrentLabel").SetDialogVariableInt("price", 50);
            if (turnState.preRolled) {
                $.GetContextPanel().AddClass("JailPreRolled");
            }
            break;
        case "card_prompt":
            let imageUrl: string;
            switch (turnState.deck) {
                case "chance":
                    imageUrl = "s2r://panorama/images/icons/icon_info.vsvg";
                    break;
                case "communitychest":
                    imageUrl = "s2r://panorama/images/icons/icon_treasure.vsvg";
                    break;
            } 
            ($("#CardPromptImage") as ImagePanel).SetImage(imageUrl);
            ($("#CardDeckType") as LabelPanel).text = locale[`deck_${turnState.deck}`];
            break;
        case "card_result":
        case "auxroll_result":
            let colourClass = "";
            $("#CardResultButton").RemoveClass("green");
            $("#CardResultButton").RemoveClass("red");

            // Set colours
            switch(turnState.card.type) {
                case "money_gain":
                case "money_gain_others":
                case "fuckjail":
                    colourClass = "green";
                    break;
                case "jail":
                case "repairs":
                case "money_lose":
                case "money_lose_others":
                    colourClass = "red";
                    break;
                case "teleport_category":
                    if (turnState.type === "auxroll_result") {
                        colourClass = "red";
                    }
                    break;
            }
            let text: string;
            if (turnState.type === "auxroll_result") {
                text = locale["payrent"];
            } else {
                text = locale["card_" + turnState.card.type];
            }
            ($("#CardResultButtonText") as LabelPanel).text = text;
            let resultText = locale[turnState.card.text];
            ($("#CardResultText") as LabelPanel).text = resultText;
            if (colourClass !== "") {
                $("#CardResultButton").AddClass(colourClass);
            }
            // Functional logic
            switch(turnState.card.type) {
                case "money_gain":
                case "money_gain_others":
                case "money_lose":
                case "money_lose_others":
                    ($("#CardResultText") as LabelPanel).text = ($("#CardResultText") as LabelPanel).text.replaceAll("{d:value}", turnState.card.value.toFixed(0));
                    ($("#CardResultButtonText") as LabelPanel).text = ($("#CardResultButtonText") as LabelPanel).text.replaceAll("{d:value}", turnState.card.value.toFixed(0));
                    break;
                case "repairs":
                    ($("#CardResultText") as LabelPanel).text = ($("#CardResultText") as LabelPanel).text.replaceAll("{d:house}", turnState.card.house.toFixed(0));
                    ($("#CardResultText") as LabelPanel).text = ($("#CardResultText") as LabelPanel).text.replaceAll("{d:hotel}", turnState.card.hotel.toFixed(0));
                    break;
                case "teleport":
                    ($("#CardResultText") as LabelPanel).text = ($("#CardResultText") as LabelPanel).text.replaceAll("{s:dest}", locale["tile_" + turnState.card.dest]);
                    break;
                case "teleport_relative":
                    ($("#CardResultText") as LabelPanel).text = ($("#CardResultText") as LabelPanel).text.replaceAll("{d:value}", Math.abs(turnState.card.value).toFixed(0));
                    ($("#CardResultButtonText") as LabelPanel).text = ($("#CardResultButtonText") as LabelPanel).text.replaceAll("{d:value}", Math.abs(turnState.card.value).toFixed(0));
                    break;
                case "teleport_category":
                    if (turnState.type === "auxroll_result") {
                        ($("#CardResultButtonText") as LabelPanel).text = ($("#CardResultButtonText") as LabelPanel).text.replaceAll("{d:price}", turnState.value.toFixed(0));
                    }
            }
            
            if (turnState.card.type === "money_lose" || turnState.card.type === "money_lose_others") {
                let value = turnState.card.value;
                if (turnState.card.type === "money_lose_others") {
                    let aliveOthers = Object.values(playerStates).filter(player => player.pID !== turnState.pID && player.alive);
                    value = value * aliveOthers.length;
                }
                if (value > playerState.money) {
                    $.GetContextPanel().AddClass("SellStuffRequired");
                }
            }
            if (turnState.type === "auxroll_result" && turnState.value > playerState.money) {
                $.GetContextPanel().AddClass("SellStuffRequired");
            }
            // TODO: Repairs
            break;
        case "endturn":
            $.Msg(playerState);
            if (playerState.jailed > 0 && playerState.jailed < 3) {
                $.GetContextPanel().AddClass("JailDice");
                let diceRolls = turnState.rolls;
                ($("#dice1") as LabelPanel).text = diceRolls[diceRolls.length - 1].dice1.toFixed(0);
                ($("#dice2") as LabelPanel).text = diceRolls[diceRolls.length - 1].dice2.toFixed(0);
            }
            break;
    }

});


function RollDice() {
    $.DispatchEvent('CitadelConCommand', `monopolis_requestdiceroll`);
}

function BuyProperty() {
    $.DispatchEvent('CitadelConCommand', `monopolis_requestpurchase`);
}
function Auction() {
    $.DispatchEvent('CitadelConCommand', `monopolis_requestauction`);
}

function PayRent() {
    $.DispatchEvent('CitadelConCommand', `monopolis_requestpayrent`);
}

function Endturn() {
    $.DispatchEvent('CitadelConCommand', `monopolis_endturn`);
}

function Bankrupt() {
    $.DispatchEvent('CitadelConCommand', `monopolis_requestbankrupt`);
}

function StartTrade() {
    $.DispatchEvent('CitadelConCommand', `monopolis_requesttrade`);
}

function DrawCard() {
    $.Msg("Draw card?");
    $.DispatchEvent('CitadelConCommand', `monopolis_requestcard`);
}
function AcknowledgeCard() {
    $.DispatchEvent('CitadelConCommand', `monopolis_acknowledgecard`);
}

function AuctionBid(bidAmount: number) {
    $.Msg(bidAmount, typeof bidAmount);
    if (bidAmount !== 10 && bidAmount !== 50 && bidAmount !== 100) {
        return;
    }
    $.DispatchEvent('CitadelConCommand', `monopolis_auctionbid ${bidAmount}`);
}
function AuctionWithdraw() {
    $.Msg("Withdraw");
    $.DispatchEvent('CitadelConCommand', `monopolis_auctionwithdraw`);
}

type PanoramaPlayerState = Record<string, PlayerState & { steamId: string, connection: {name: string, bot: boolean}} >;

Modlock.route("player_state", (state: PanoramaPlayerState) => {
    $.Msg("Player state", state);
    if (!state) return;

    const turnState = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_current_turn", "{}")) as TurnState;

    for (let player of Object.values(state)) {
        const pID = player.pID;
        let existingPanel = $(`#MoneyTable_${pID}`);
        let existingTradePanel = $(`#TradePlayerSlot_${pID}`);

        if (existingPanel.BHasClass("Hidden")) {
            existingPanel.RemoveClass("Hidden");
            (existingPanel.FindChildTraverse("Image") as AvatarImage).steamid = player.steamId;
            (existingPanel.FindChildTraverse("Name") as UserName).steamid = player.steamId;
        }
        if (existingTradePanel.BHasClass("Hidden")) {
            existingTradePanel.RemoveClass("Hidden");
            (existingTradePanel.FindChildTraverse("PlayerImage") as AvatarImage).steamid = player.steamId;
            (existingTradePanel.FindChildTraverse("PlayerName") as UserName).steamid = player.steamId;
        }


        (existingPanel.FindChildTraverse("GoldAmount") as LabelPanel).text = player.money.toFixed(0);
        //existingPanel.style.borderColor = ColorToHexCode2(Players.GetPlayerColor(Number.parseInt(pID) as PlayerID));

        let currentTurn = $.GetContextPanel().GetAttributeInt("currentturn", -1);
        if (currentTurn === player.pID) {
            // Jailed people dont get to reroll
            if (player.jailed > 0) {
                ($("#endturnLabel") as LabelPanel).text = locale["endturn"];
            }
            if (turnState.type === "payrent" && player.money >= turnState.price) {
                $.GetContextPanel().RemoveClass("SellStuffRequired");
            }
            else if (turnState.type === "card_result") {
                if (turnState.card.type === "money_lose" || turnState.card.type === "money_lose_others") { 
                    let value = turnState.card.value;
                    if (turnState.card.type === "money_lose_others") {
                        let playerStates = Object.values(state);
                        let aliveOthers = playerStates.filter(player => player.pID !== turnState.pID && player.alive);
                        value = value * aliveOthers.length;
                    }
                    if (player.money >= value) {
                        $.GetContextPanel().RemoveClass("SellStuffRequired");
                    }
                }
            }
            else if (turnState.type === "auxroll_result" && player.money >= turnState.value) {
                $.GetContextPanel().RemoveClass("SellStuffRequired");
            }
        }

    }
});

function AddHouse(tile: PurchasableTiles) {
    $.Msg("Adding house to ", tile);
    const propertyOwnerships = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_property_ownership", "{}")) as Record<PurchasableTiles, PropertyOwnership>;
    const property = propertyOwnerships[tile];
    if (!property) return;
    if (property.houseCount > 5) return;
    $.DispatchEvent('CitadelConCommand', `monopolis_requestrenovation ${JSON.stringify({property: tile, houseCount: property.houseCount + 1})}`);
}
function RemoveHouse(tile: PurchasableTiles) {
    $.Msg("Removing house from ", tile);
    const propertyOwnerships = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_property_ownership", "{}")) as Record<PurchasableTiles, PropertyOwnership>;
    const property = propertyOwnerships[tile];
    if (!property) return;
    if (property.houseCount < -1) return;
    $.DispatchEvent('CitadelConCommand', `monopolis_requestrenovation ${JSON.stringify({property: tile, houseCount: property.houseCount - 1})}`);
}
