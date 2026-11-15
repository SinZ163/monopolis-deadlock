function onTooltip() { 
    const property = $.GetContextPanel().GetAttributeString("property", "go") as Tiles;
    const propertyData = TilesObj[property];
    $.Msg("Hello World from a property tooltip " + property);

    $.GetContextPanel().SwitchClass("category", propertyData.type === "property" ? propertyData.category : propertyData.type);


    ($("#PropertyLabel") as LabelPanel).text = locale[`tile_${property}`];
    // TODO: Utility/Railroad
    if (propertyData?.type == "property") {
        // TODO: Update based on state
        ($("#ActiveRentValue") as LabelPanel).text = propertyData.rentPrice.toFixed(0);


        ($("#PurchasePrice") as LabelPanel).text = propertyData.purchasePrice.toFixed(0);
        ($("#MortgageValue") as LabelPanel).text = Math.round(propertyData.purchasePrice / 2).toFixed(0);
        ($("#BuildingCostValue") as LabelPanel).text = propertyData.housePrice.toFixed(0);
        ($("#BaseRentValue") as LabelPanel).text = propertyData.rentPrice.toFixed(0);
        ($("#MonopolyRentValue") as LabelPanel).text = (propertyData.rentPrice * 2).toFixed(0);
        ($("#house1RentValue") as LabelPanel).text = propertyData.house1Price.toFixed(0);
        ($("#house2RentValue") as LabelPanel).text = propertyData.house2Price.toFixed(0);
        ($("#house3RentValue") as LabelPanel).text = propertyData.house3Price.toFixed(0);
        ($("#house4RentValue") as LabelPanel).text = propertyData.house4Price.toFixed(0);
        ($("#hotelRentValue") as LabelPanel).text = propertyData.hotelPrice.toFixed(0);

    }
}
onTooltip();