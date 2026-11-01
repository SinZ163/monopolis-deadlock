
interface MonopolisEmptyEvent {}
interface MonopolisDiceRoll {
    dice1: number,
    dice2: number
}

interface MonopolisStartTurn {
    indicators: Partial<Record<Tiles, number>>;
}

interface MonopolisRenovationEvent {
    property: PurchasableTiles;
    houseCount: number;
}

interface MonopolisAuctionBid {
    amount: 10|50|100,
}

interface MonopolisAddPropertyTradeEvent {
    type: "add_property",
    property: PurchasableTiles,
    from: PlayerID,
    to: PlayerID,
}
interface MonopolisAddMoneyTradeEvent {
    type: "add_money",
    money: number,
    from: PlayerID,
    to: PlayerID,
}
interface MonopolisRemovePropertyTradeEvent {
    type: "remove_property",
    property: PurchasableTiles
}
interface MonopolisRemoveMoneyTradeEvent {
    type: "remove_money",
    money: number,
    from: PlayerID,
    to: PlayerID,
}
interface MonopolisConfirmTradeEvent {
    type: "confirm"
}
interface MonopolisCancelTradeEvent {
    type: "cancel"
}
interface MonopolisAcceptTradeEvent {
    type: "accept"
}
interface MonopolisRejectTradeEvent {
    type: "reject"
}

type MonopolisTradeEvent = MonopolisAddPropertyTradeEvent | MonopolisRemovePropertyTradeEvent | MonopolisAddMoneyTradeEvent | MonopolisRemoveMoneyTradeEvent | MonopolisConfirmTradeEvent | MonopolisCancelTradeEvent | MonopolisAcceptTradeEvent | MonopolisRejectTradeEvent;