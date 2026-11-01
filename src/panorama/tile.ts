/// <reference path="../common/common.ts" />

const tilename = $.GetContextPanel().id as Tiles;
let tile = TilesObj[tilename];

$.GetContextPanel().AddClass(tile.type);

if (tile.type === "misc") {
    let cornerName = tilename as Exclude<Tiles, PricedTiles|CardTiles>;
    let cornerTextAbove = $("#CornerTextAbove") as LabelPanel;
    cornerTextAbove.text = locale[`${cornerName}_above`];
    let cornerTextBelow = $("#CornerTextBelow") as LabelPanel;
    cornerTextBelow.text = locale[`${cornerName}_below`];
    let image: string = "";
    switch(cornerName) {
        case "go":
            image = "s2r://panorama/images/icons/logo_deadlock_mark_only_png.vtex";
            break;
        case "gotojail":
            image = "s2r://panorama/images/icons/properties/condition_disarm.vsvg";
            break;
        case "jail":
            image = "s2r://panorama/images/icons/not.vsvg";
            break;
        case "freeparking":
            image = "s2r://panorama/images/upgrades/mods_armor/healing_booster_psd.vtex";
            break;
    }
    ($("#CornerImage") as ImagePanel).SetImage(image);
} else {
    let spaceName = $("#SpaceName") as LabelPanel;
    spaceName.text = locale[`tile_${tilename}`];

    let image = $("#Image") as ImagePanel;
    if (image) {
        switch (tilename) {
            case "chance1":
            case "chance2":
            case "chance3":
                image.SetImage("s2r://panorama/images/icons/icon_info.vsvg");
                break;
            case "communitychest1":
            case "communitychest2":
            case "communitychest3":
                image.SetImage("s2r://panorama/images/icons/icon_treasure.vsvg");
                break;
            case "utility1":
                image.SetImage("s2r://panorama/images/upgrades/energy_icon_psd.vtex");
                break;
            case "utility2":
                image.SetImage("s2r://panorama/images/icons/icon_flask.vsvg");
                break;
            case "railroad1":
            case "railroad2":
            case "railroad3":
            case "railroad4":
                image.SetImage("s2r://panorama/images/minimap/minimap_teleporter_highlight.vsvg");
                break;
            case "tax1":
                image.SetImage("s2r://panorama/images/upgrades/mods_tech/magic_storm_psd.vtex");
                break;
            case "tax2":
                image.SetImage("s2r://panorama/images/hud/modifiers/modifier_cadence_bullet_shard_psd.vtex");
                break;
        }
    }
}

let price: number|undefined = undefined;
if (tile.type === "tax") {
    let payText = $("#PaymentText") as LabelPanel;
    $.GetContextPanel().AddClass("HasPayment");
    payText.text = locale["pay"];
    price = tile.cost;
    $.Msg(price, tile);
}
if (tile.type === "property" || tile.type === "railroad" || tile.type === "utility") {
    price = tile.purchasePrice;
}
if (price !== undefined) {
    let spacePrice = $("#SpacePrice") as LabelPanel;
    spacePrice.text = (price).toFixed(0);
}