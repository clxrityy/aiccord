require("colors");
const { testGuildId } = require("../../config.json");
// const commandCompare = require("../../util/commandCompare");
const getApplicationContextMenus = require("../../util/getApplicationCommands");
const getLocalContextMenus = require("../../util/getLocalContextMenus");

module.exports = async (client) => {
    try {
        const localContextMenus = getLocalContextMenus();
        const applicationContextMenus = getApplicationContextMenus(client) //, testGuildId);

        for (const localContextMenu of localContextMenus) {
            const { data } = localContextMenu;
            const contextMenuName = data.name;
            const contextMenuType = data.type;

            const existingContextMenu = await applicationContextMenus.cache.find((ctx) => ctx.name === contextMenuName);

            if (existingContextMenu) {
                if (localContextMenu.deleted) {
                    await applicationContextMenus.delete(existingContextMenu.id);
                    console.log(`[INFO] Context menu ${contextMenuName} has been deleted`.red);
                    continue;
                }
            } else {
                if (localContextMenu.deleted) {
                    console.log(`[INFO] Context menu ${contextMenuName} has been skipped. (Property "deleted" set to "true")`.grey);
                    continue;
                }

                await applicationContextMenus.create({ name: contextMenuName, type: contextMenuType });
                console.log(`[INFO] Context menu ${contextMenuName} has been registered`.green);
            }

            // if (deleted) {
            //     if (existingCommand) {
            //         await applicationCommands.delete(existingCommand.id);
            //         console.log(`[COMMAND INFO] Application command ${commandName} has been deleted.`.red);
            //     } else {
            //         console.log(`[COMMAND INFO] Application command ${commandName} has been skipped.`.grey);
            //     }
            // } else if (existingCommand) {
            //     if (commandCompare(existingCommand, localCommand)) {
            //         await applicationCommands.edit(existingCommand.id, { name: commandName, description: commandDescription, options: commandOptions });
            //         console.log(`[COMMAND INFO] Application command ${commandName} has been edited.`.yellow);
            //     }
            // } else {
            //     await applicationCommands.create({
            //         name: commandName, description: commandDescription, options: commandOptions
            //     });
            //     console.log(`[COMMAND INFO] Application command ${commandName} has been registered.`.green);
            // }

        }
    } catch (error) {
        console.log(`[ERROR] An error inside the context menu registry has occurred:\n ${error}`.bgRed);
    }
}