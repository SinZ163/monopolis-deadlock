let layoutBasePath = $.GetContextPanel().layoutfile.replaceAll("\\", "/");
let firstPathSep = layoutBasePath.indexOf("/");
let lastPathSep = layoutBasePath.lastIndexOf("/");
layoutBasePath = "file://{resources}/" + layoutBasePath.substring(firstPathSep, lastPathSep + 1);

function cronJob() {
    const context = $.GetContextPanel().GetParent();
    if (!context) return;
    let found = false;
    for (let space of Object.keys(TilesObj) as Tiles[]) {
        if (context.BHasClass("Entity_" + space)) {
            found = true;

            let spaceInfo = TilesObj[space];
            
            // TODO: Corners get their own
            // TODO: ImageSpaces get their own
            if (spaceInfo.type === "misc") {
                $.CreatePanel("Panel", $.GetContextPanel(), space).BLoadLayout(layoutBasePath + "corner_space.xml", false, false);
            } else if (spaceInfo.type === "card") {
                $.CreatePanel("Panel", $.GetContextPanel(), space).BLoadLayout(layoutBasePath + "card_space.xml", false, false);
            } else {
                $.CreatePanel("Panel", $.GetContextPanel(), space).BLoadLayout(layoutBasePath + "space.xml", false, false);
            }
            $.CancelScheduled(schedule);
            break;
        }
    }
    if (!found) {
        schedule = $.Schedule(1, cronJob);
    }
}
let schedule = $.Schedule(1, cronJob);