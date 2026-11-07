/// <reference path="general.d.ts" />
const TilesObj: Record<Tiles, SpaceDefinition> = {
    go: {
        type: "misc",
        id: "go",
        index: 0
    },
    brown1: {
        type: "property",
        category: "brown",
        categoryId: 0,
        id: "brown1",
        index: 1,
        purchasePrice: 60,
        housePrice: 50,
        rentPrice: 2,
        house1Price: 10,
        house2Price: 30,
        house3Price: 90,
        house4Price: 160,
        hotelPrice: 250
    },
    communitychest1: {
        type: "card",
        id: "communitychest1",
        index: 2,
        deck: "communitychest"
    },
    brown2: {
        type: "property",
        id: "brown2",
        category: "brown",
        categoryId: 0,
        index: 3,
        purchasePrice: 60,
        housePrice: 50,
        rentPrice: 4,
        house1Price: 20,
        house2Price: 60,
        house3Price: 180,
        house4Price: 320,
        hotelPrice: 450
    },
    tax1: {
        type: "tax",
        id: "tax1",
        index: 4,
        cost: 200
    },
    railroad1: {
        type: "railroad",
        id: "railroad1",
        categoryId: 9,
        index: 5,
        purchasePrice: 200,
        prices: [25, 50, 100, 200]
    },
    teal1: {
        type: "property",
        id: "teal1",
        category: "teal",
        categoryId: 1,
        index: 6,
        purchasePrice: 100,
        housePrice: 50,
        rentPrice: 6,
        house1Price: 30,
        house2Price: 90,
        house3Price: 270,
        house4Price: 400,
        hotelPrice: 550
    },
    chance1: {
        type: "card",
        id: "chance1",
        index: 7,
        deck: "chance"
    },
    teal2: {
        type: "property",
        id: "teal2",
        category: "teal",
        categoryId: 1,
        index: 8,
        purchasePrice: 100,
        housePrice: 50,
        rentPrice: 6,
        house1Price: 30,
        house2Price: 90,
        house3Price: 270,
        house4Price: 400,
        hotelPrice: 550
    },
    teal3: {
        type: "property",
        id: "teal3",
        category: "teal",
        categoryId: 1,
        index: 9,
        purchasePrice: 120,
        housePrice: 50,
        rentPrice: 8,
        house1Price: 40,
        house2Price: 100,
        house3Price: 300,
        house4Price: 450,
        hotelPrice: 600
    },
    jail: {
        type: "misc",
        id: "jail",
        index: 10
    },
    magenta1: {
        type: "property",
        id: "magenta1",
        category: "magenta",
        categoryId: 2,
        index: 11,
        purchasePrice: 140,
        housePrice: 100,
        rentPrice: 10,
        house1Price: 50,
        house2Price: 150,
        house3Price: 450,
        house4Price: 625,
        hotelPrice: 750
    },
    utility1: {
        type: "utility",
        id: "utility1",
        categoryId: 8,
        index: 12,
        purchasePrice: 150,
        multipliers: [4, 10]
    },
    magenta2: {
        type: "property",
        id: "magenta2",
        category: "magenta",
        categoryId: 2,
        index: 13,
        purchasePrice: 140,
        housePrice: 100,
        rentPrice: 10,
        house1Price: 50,
        house2Price: 150,
        house3Price: 450,
        house4Price: 625,
        hotelPrice: 750
    },
    magenta3: {
        type: "property",
        id: "magenta3",
        category: "magenta",
        categoryId: 2,
        index: 14,
        purchasePrice: 160,
        housePrice: 100,
        rentPrice: 12,
        house1Price: 60,
        house2Price: 180,
        house3Price: 500,
        house4Price: 700,
        hotelPrice: 900
    },
    railroad2: {
        type: "railroad",
        id: "railroad2",
        categoryId: 9,
        index: 15,
        purchasePrice: 200,
        prices: [25, 50, 100, 200]
    },
    orange1: {
        type: "property",
        id: "orange1",
        category: "orange",
        categoryId: 3,
        index: 16,
        purchasePrice: 180,
        housePrice: 100,
        rentPrice: 14,
        house1Price: 70,
        house2Price: 200,
        house3Price: 550,
        house4Price: 750,
        hotelPrice: 950
    },
    communitychest2: {
        type: "card",
        id: "communitychest2",
        index: 17,
        deck: "communitychest"
    },
    orange2: {
        type: "property",
        id: "orange2",
        category: "orange",
        categoryId: 3,
        index: 18,
        purchasePrice: 180,
        housePrice: 100,
        rentPrice: 14,
        house1Price: 70,
        house2Price: 200,
        house3Price: 550,
        house4Price: 750,
        hotelPrice: 950
    },
    orange3: {
        type: "property",
        id: "orange3",
        category: "orange",
        categoryId: 3,
        index: 19,
        purchasePrice: 200,
        rentPrice: 16,
        housePrice: 100,
        house1Price: 80,
        house2Price: 220,
        house3Price: 600,
        house4Price: 800,
        hotelPrice: 1000
    },
    freeparking: {
        type: "misc",
        id: "freeparking",
        index: 20
    },
    red1: {
        type: "property",
        id: "red1",
        category: "red",
        categoryId: 4,
        index: 21,
        purchasePrice: 220,
        housePrice: 150,
        rentPrice: 18,
        house1Price: 90,
        house2Price: 250,
        house3Price: 700,
        house4Price: 875,
        hotelPrice: 1050
    },
    chance2: {
        type: "card",
        id: "chance2",
        index: 22,
        deck: "chance"
    },
    red2: {
        type: "property",
        id: "red2",
        category: "red",
        categoryId: 4,
        index: 23,
        purchasePrice: 220,
        housePrice: 150,
        rentPrice: 18,
        house1Price: 90,
        house2Price: 250,
        house3Price: 700,
        house4Price: 875,
        hotelPrice: 1050
    },
    red3: {
        type: "property",
        id: "red3",
        category: "red",
        categoryId: 4,
        index: 24,
        purchasePrice: 240,
        housePrice: 150,
        rentPrice: 20,
        house1Price: 100,
        house2Price: 300,
        house3Price: 750,
        house4Price: 925,
        hotelPrice: 1100
    },
    railroad3: {
        type: "railroad",
        id: "railroad3",
        categoryId: 9,
        index: 25,
        purchasePrice: 200,
        prices: [25, 50, 100, 200]
    },
    yellow1: {
        type: "property",
        id: "yellow1",
        category: "yellow",
        categoryId: 5,
        index: 26,
        purchasePrice: 260,
        housePrice: 150,
        rentPrice: 22,
        house1Price: 110,
        house2Price: 330,
        house3Price: 800,
        house4Price: 950,
        hotelPrice: 1150
    },
    yellow2: {
        type: "property",
        id: "yellow2",
        category: "yellow",
        categoryId: 5,
        index: 27,
        purchasePrice: 260,
        housePrice: 150,
        rentPrice: 22,
        house1Price: 110,
        house2Price: 330,
        house3Price: 800,
        house4Price: 950,
        hotelPrice: 1150
    },
    utility2: {
        type: "utility",
        id: "utility2",
        categoryId: 8,
        index: 28,
        purchasePrice: 150,
        multipliers: [4, 10]
    },
    yellow3: {
        type: "property",
        id: "yellow3",
        category: "yellow",
        categoryId: 5,
        index: 29,
        purchasePrice: 280,
        housePrice: 150,
        rentPrice: 24,
        house1Price: 120,
        house2Price: 360,
        house3Price: 850,
        house4Price: 1025,
        hotelPrice: 1200
    },
    gotojail: {
        type: "misc",
        id: "gotojail",
        index: 30
    },
    green1: {
        type: "property",
        id: "green1",
        category: "green",
        categoryId: 6,
        index: 31,
        purchasePrice: 300,
        housePrice: 200,
        rentPrice: 26,
        house1Price: 130,
        house2Price: 390,
        house3Price: 900,
        house4Price: 1100,
        hotelPrice: 1275
    },
    green2: {
        type: "property",
        id: "green2",
        category: "green",
        categoryId: 6,
        index: 32,
        purchasePrice: 300,
        housePrice: 200,
        rentPrice: 26,
        house1Price: 130,
        house2Price: 390,
        house3Price: 900,
        house4Price: 1100,
        hotelPrice: 1275
    },
    communitychest3: {
        type: "card",
        id: "communitychest3",
        index: 33,
        deck: "communitychest"
    },
    green3: {
        type: "property",
        id: "green3",
        category: "green",
        categoryId: 6,
        index: 34,
        purchasePrice: 320,
        housePrice: 200,
        rentPrice: 28,
        house1Price: 150,
        house2Price: 450,
        house3Price: 1000,
        house4Price: 1200,
        hotelPrice: 1400
    },
    railroad4: {
        type: "railroad",
        id: "railroad4",
        categoryId: 9,
        index: 35,
        purchasePrice: 200,
        prices: [25, 50, 100, 200]
    },
    chance3: {
        type: "card",
        id: "chance3",
        index: 36,
        deck: "chance"
    },
    blue1: {
        type: "property",
        id: "blue1",
        category: "blue",
        categoryId: 7,
        index: 37,
        purchasePrice: 350,
        housePrice: 200,
        rentPrice: 35,
        house1Price: 175,
        house2Price: 500,
        house3Price: 1100,
        house4Price: 1300,
        hotelPrice: 1500
    },
    tax2: {
        type: "tax",
        id: "tax2",
        index: 38,
        cost: 100
    },
    blue2: {
        type: "property",
        id: "blue2",
        category: "blue",
        categoryId: 7,
        index: 39,
        purchasePrice: 400,
        housePrice: 200,
        rentPrice: 50,
        house1Price: 200,
        house2Price: 600,
        house3Price: 1400,
        house4Price: 1700,
        hotelPrice: 2000
    }
};
const locale: Record<string,string> = {
    "tile_go": "GO",

    "tile_brown1": "Mediterranean Avenue",
    "tile_brown2": "Baltic Avenue",

    "tile_teal1": "Oriental Avenue",
    "tile_teal2": "Vermont Avenue",
    "tile_teal3": "Connecticut Avenue",

    "tile_magenta1": "St. Charles Place",
    "tile_magenta2": "States Avenue",
    "tile_magenta3": "Virginia Avenue",

    "tile_orange1": "St. James Place",
    "tile_orange2": "Tennessee Avenue",
    "tile_orange3": "New York Avenue",

    "tile_red1": "Kentucky Avenue",
    "tile_red2": "Indiana Avenue",
    "tile_red3": "Illinois Avenue",

    "tile_yellow1": "Atlantic Avenue",
    "tile_yellow2": "Ventnor Avenue",
    "tile_yellow3": "Marvin Gardens",

    "tile_green1": "Pacific Avenue",
    "tile_green2": "North Carolina Avenue",
    "tile_green3": "Pennslvania Avenue",

    "tile_blue1": "Park Place",
    "tile_blue2": "Boardwalk",

    "tile_railroad1": "Reading Railroad",
    "tile_railroad2": "Pennsylvania Railroad",
    "tile_railroad3": "B & O Railroad",
    "tile_railroad4": "Short Line",

    "tile_utility1": "Electric Company",
    "tile_utility2": "Water Works",

    "tile_chance1": "Chance",
    "tile_chance2": "Chance",
    "tile_chance3": "Chance",
    "tile_communitychest1": "Community Chest",
    "tile_communitychest2": "Community Chest",
    "tile_communitychest3": "Community Chest",

    "tile_tax1": "Income Tax",
    "tile_tax2": "Luxury Tax",
    
    // Following 3 aren't used but keep typescript happy that 100% of tiles have localization
    "tile_jail": "JAIL",
    "tile_freeparking": "Free Parking",
    "tile_gotojail": "Go To Jail",

    "go_above": "",
    "go_below": "GO",

    "freeparking_above": "FREE",
    "freeparking_below": "PARKING",

    "gotojail_above": "GO TO",
    "gotojail_below": "JAIL",

    "jail_above": "",
    "jail_below": "JAIL",

    "pay": "Pay",

    "auction": "Auction",
    "endturn": "End turn",
    "reroll": "Re-roll",
    "rolldice": "Roll Dice",
    "starttrade": "Start Trade",
    "monopolis_bankrupt": "Bankrupt",
    "drawcard": "Draw Card",

    "buyproperty": "Buy {s:property}",


    "payrent": "Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:price}",

    "deck_communitychest": "COMMUNITY CHEST",
    "deck_chance": "CHANCE",

    "card_money_gain": "Gain <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}",
    "card_money_gain_others": "Gain <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:total}",
    "card_money_lose": "Pay {d:value}",
    "card_money_lose_others": "Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:total}",
    "card_repairs": "Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:var1} ({d:var2} houses, {d:var3} hotels)",

    "card_teleport": "OK",
    "card_teleport_category": "OK",
    "card_teleport_relative": "OK",
    "card_jail": "OK",

    "card_jail_text": "Go to Jail. Go directly to Jail. Do not pass GO, do not collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />200.",
    "card_fuckjail_text": "Get out of Jail Free. This card may be kept until needed, or traded/sold.",

    "card_adv": "Advance to {s:dest}. If you pass Go, collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />200.",
    "card_adv_go": "Advance to {s:dest}. (Collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />200)",
    "card_adv_railroad1": "Take a trip to {s:dest}. If you pass Go, collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />200.",
    "card_adv_blue2": "Take a walk on the {s:dest}.",
    "card_adv_utility": "Advance token to the nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total 10 times the amount thrown.",
    "card_adv_railroad": "Advance to the next Railroad. If unowned, you may buy it from the Bank. If owned, pay the owner twice the rent to which they are otherwise entitled. If railroad is unowned, you may buy it from the Bank.",
    "card_adv_relative_back": "Go back {d:value} spaces.",

    "CHANCE_BankDividend": "Bank pays you dividend of <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "CHANCE_GeneralRepairs": "Make general repairs on all your property: For each house pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:house}, For each hotel pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:hotel}.",
    "CHANCE_Speeding": "Speeding fine <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}",
    "CHANCE_Chairman": "You have been elected Chairman of the Board.<br> Pay each player <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "CHANCE_BuildingLoan": "Your building loan matures. Receive <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",

    "COMMUNITYCHEST_BankError": "Bank error in your favor. Collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Doctor": "Doctor's fees. Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Stock": "From sale of stock you get <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_HolidaySeason": "Holiday Fund matures. Receive <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Income": "Income tax refund. Collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Birthday": "It is your birthday. Collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value} from every player.",
    "COMMUNITYCHEST_LifeInsurance": "Life insurance matures - Collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Hospital": "Hospital Fees. Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_School": "School fees. Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Consultancy": "Receive <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value} consultancy fee.",
    "COMMUNITYCHEST_StreetRepairs": "You are assessed for street repairs: Pay <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:house} per house and <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:hotel} per hotel you own.",
    "COMMUNITYCHEST_Beauty": "You have won second prize in a beauty contest. Collect <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",
    "COMMUNITYCHEST_Inherit": "You inherit <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:value}.",

    "monopolis_propertymanagement_mortgaged": "Mortgaged",
    "monopolis_propertymanagement_owned": "Owned",
    "monopolis_propertymanagement_houses": "{d:houseCount} House",
    "monopolis_propertymanagement_hotel": "Hotel",

    "monopolis_auction_value": "Auction Value: ",
    "monopolis_auction_bid10_button": "Bid <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />10",
    "monopolis_auction_bid50_button": "Bid <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />50",
    "monopolis_auction_bid100_button": "Bid <img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />100",
    "monopolis_auction_withdraw_button": "Withdraw",

    "monopolis_auction_bid10": "<img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />10",
    "monopolis_auction_bid50": "<img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />50",
    "monopolis_auction_bid100": "<img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />100",

    "monopolis_auction_failed": "Auction failed due to no bids, property remained unowned.",

    "monopolis_money": "<img class=\"inlinegold\" src=\"s2r://panorama/images/hud/icons/icon_soul.vsvg\" />{d:money}",

    "tradeconfirm_button": "Confirm",
    "tradecancel_button": "Cancel",
    "tradeaccept_button": "Accept",
    "tradereject_button": "Reject",
}


enum TradeStateStatus {
    ModifyTrade,
    Confirmation,
    Finalized,
}

// Keep this file a plain script for Panorama's ordered layout includes.
// An explicit global also survives module scoping and tree-shaking in modlock.
declare var MonopolisCommon: {
    TilesObj: typeof TilesObj;
    locale: typeof locale;
    TradeStateStatus: typeof TradeStateStatus;
};
globalThis.MonopolisCommon = { TilesObj, locale, TradeStateStatus };