/// <reference path="general.d.ts" />
const TilesObj: Record<Tiles,SpaceDefinition> = {
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
const locale = {
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
}

// Keep this file a plain script for Panorama's ordered layout includes.
// An explicit global also survives module scoping and tree-shaking in modlock.
declare var MonopolisCommon: {
    TilesObj: typeof TilesObj;
    locale: typeof locale;
};
globalThis.MonopolisCommon = { TilesObj, locale };