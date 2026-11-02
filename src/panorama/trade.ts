function OnTradePropertyDragStart(panel: Panel, callback: any) {
    $.Msg("DragStart", panel);
    $.Msg("DragStart2", callback);
    if (panel.BHasClass("Owner") || panel.BHasClass("Mortgaged")) {
        let displayPanel = $.CreatePanel("Panel", panel, "TradeDragImage");
        (displayPanel.Data() as any).tile = (panel.Data() as any).tile;
        (displayPanel.Data() as any).category = (panel.Data() as any).category;
        (displayPanel.Data() as any).pID = (panel.Data() as any).pID;
        displayPanel.AddClass((panel.Data() as any).category);
        displayPanel.SetHasClass("Owner", panel.BHasClass("Owner"));
        displayPanel.SetHasClass("Mortgaged", panel.BHasClass("Mortgaged"));
        displayPanel.AddClass("TradePropertyCategoryCell");
        callback.displayPanel = displayPanel;
        callback.offsetX = 0;
        callback.offsetY = 0;
    }
    return true;
}
function OnTradePropertyDragEnd(panel: Panel, draggedPanel: Panel) {
    $.Msg("DragEnd", panel.id, panel.Data());
    $.Msg("DragEnd2", draggedPanel.id, draggedPanel.Data());
    draggedPanel.DeleteAsync(0);
    return true;
}
function OnTradePropertyDragEnter(panel: Panel, draggedPanel: Panel) {
    $.Msg("DragEnter", panel.id, panel.Data());
    $.Msg("DragEnter2", draggedPanel.id, draggedPanel.Data());
}
function OnTradePropertyDragLeave(panel: Panel, draggedPanel: Panel) {
    $.Msg("DragLeave", panel.id, panel.Data());
    $.Msg("DragLeave2", draggedPanel.id, draggedPanel.Data());
}
function OnTradePropertyDragDrop(panel: Panel, draggedPanel: Panel) {
    $.Msg("DragDrop", panel.id, panel.Data());
    $.Msg("DragDrop2", draggedPanel.id, draggedPanel.Data());
    let newPID: PlayerID = (panel.Data() as any).pID;
    let oldPID: PlayerID = (draggedPanel.Data() as any).pID;
    if (draggedPanel.BHasClass("TradePropertyCategoryCell")) {
        let tile: PurchasableTiles = (draggedPanel.Data() as any).tile;
        $.Msg(tile, oldPID, newPID);
        if (newPID !== oldPID) {
            $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "add_property", property: tile, from: oldPID, to: newPID})}`);
        }
    } else if (draggedPanel.BHasClass("TradeMoneyCell")) {
        let value = (draggedPanel as NumberEntry).value;
        $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "add_money", money: value, from: oldPID, to: newPID})}`);
    }
}

function OnTradeMoneyDragStart(panel: NumberEntry, callback: any) {
    let displayPanel = $.CreatePanel("NumberEntry", panel, "TradeDragMoney");
    displayPanel.value = panel.value;
    (displayPanel.Data() as any).pID = (panel.Data() as any).pID;
    displayPanel.AddClass("TradeMoneyCell");
    callback.displayPanel = displayPanel;
    callback.offsetX = 0;
    callback.offsetY = 0;
}
function OnTradeMoneyDragEnd(panel: Panel, draggedPanel: Panel) {
    draggedPanel.DeleteAsync(0);
    return true;
}

Modlock.route("trade", (tradeState: TradeState) => {
    $.Msg("trade", tradeState);
    if (!tradeState) return;

    $("#TradeSummary").RemoveAndDeleteChildren();
    const playerStates = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_player_state", "{}")) as PanoramaPlayerState;
    const propertyOwnerships = JSON.parse($.GetContextPanel().GetAttributeString("modlock_route_property_ownership", "{}")) as Record<PurchasableTiles, PropertyOwnership>;

    for (let [i, offer] of Object.entries(tradeState.offers)) {
        let panel = $.CreatePanel("Panel", $("#TradeSummary"), "TradeSummary_" + i);
        panel.BLoadLayoutSnippet("TradeOfferRow");
        (panel.FindChildTraverse("PlayerFromImage") as AvatarImage).steamid = playerStates[offer.from].steamId;
        (panel.FindChildTraverse("PlayerFromName") as UserName).steamid = playerStates[offer.from].steamId;
        (panel.FindChildTraverse("PlayerToImage") as AvatarImage).steamid = playerStates[offer.to].steamId;
        (panel.FindChildTraverse("PlayerToName") as UserName).steamid = playerStates[offer.to].steamId;

        let contentsPanel = panel.FindChildTraverse("TradeSummaryContents");
        if (!contentsPanel) return;
        
        if (offer.type === "property") {
            let propertyInfo = TilesObj[offer.property];
            let propertyPanel = $.CreatePanel("Panel", contentsPanel, "TradePropertyContainer_"+i);

            propertyPanel.AddClass(propertyInfo.type === "property" ? propertyInfo.category : propertyInfo.type);
            let ownership = propertyOwnerships[offer.property];
            if (ownership.houseCount === 0) {
                propertyPanel.AddClass("Owner");
            } else {
                propertyPanel.AddClass("Mortgaged");
            }
            propertyPanel.AddClass("TradePropertyCategoryCell");
            contentsPanel.SetPanelEvent("onactivate", () => {
                $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "remove_property", property: (offer as PropertyTradeOffer).property})}`);
            });
        } else if (offer.type === "money") {
            let moneyContainer = $.CreatePanel("Label", panel.FindChildTraverse("TradeSummaryContents")!, "TradeMoneyContainer_"+i);
            moneyContainer.html = true;
            moneyContainer.SetDialogVariableInt("money", offer.money);
            moneyContainer.AddClass("TradeMoneyText");
            moneyContainer.text = locale["monopolis_money"].replaceAll("{d:money}", offer.money.toFixed(0));
            contentsPanel.SetPanelEvent("onactivate", () => {
                let moneyOffer = offer as MoneyTradeOffer;
                $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "remove_money", money: moneyOffer.money, from: moneyOffer.from, to: moneyOffer.to})}`);
            });
        }
    }
    let tradeConfirmContainer = $("#TradeConfirmation");
    tradeConfirmContainer.SetHasClass("Hidden", tradeState.status !== TradeStateStatus.Confirmation);
    if (tradeState.status === TradeStateStatus.Confirmation) {
        let tradeConfirmPlayerContainer = $("#TradeConfirmationStatus");
        tradeConfirmPlayerContainer.RemoveAndDeleteChildren();
        for (let participant of Object.values(tradeState.participants)) {
            let playerPanel = $.CreatePanel("Panel", tradeConfirmPlayerContainer, "TradeConfirmPlayerSlot_" + participant);
            playerPanel.BLoadLayoutSnippet("TradeConfirmationSlot");
            playerPanel.SetHasClass("Accepted", tradeState.confirmations[participant] == true);
            playerPanel.SetHasClass("Rejected", tradeState.confirmations[participant] == false);
            (playerPanel.FindChildTraverse("PlayerImage") as AvatarImage).steamid = playerStates[participant].steamId;
        }
    }
});

function TradeConfirm() {
    $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "confirm"})}`);
}
function TradeCancel() {
    $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "cancel"})}`);
}
function TradeAccept() {
    $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "accept"})}`);
}
function TradeReject() {
    $.DispatchEvent('CitadelConCommand', `monopolis_trade ${JSON.stringify({type: "reject"})}`);
}