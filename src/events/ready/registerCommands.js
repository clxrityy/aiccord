require("colors");
const { testGuildId } = require("../../config/config.json");
const commandCompare = require("../../util/commandCompare");
const getApplicationCommands = require("../../util/getApplicationCommands");
const getLocalCommands = require("../../util/getLocalCommands");

module.exports = async (client) => {
    try {
        const [localCommands, applicationCommands] = await Promise.all([
            getLocalCommands(),
            getApplicationCommands(client, testGuildId)
        ]);

        for (const localCommand of localCommands) {
            const { data, deleted } = localCommand;
            const { name: commandName, description: commandDescription, options: commandOptions } = data;

            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === commandName);

            if (deleted) {
                if (existingCommand) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`[COMMAND INFO] Application command ${commandName} has been deleted.`.red);
                } else {
                    console.log(`[COMMAND INFO] Application command ${commandName} has been skipped.`.grey);
                }
            } else if (existingCommand) {
                if (commandCompare(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, { name: commandName, description: commandDescription, options: commandOptions });
                    console.log(`[COMMAND INFO] Application command ${commandName} has been edited.`.yellow);
                }
            } else {
                await applicationCommands.create({
                    name: commandName, description: commandDescription, options: commandOptions
                });
                console.log(`[COMMAND INFO] Application command ${commandName} has been registered.`.green);
            }

        }
    } catch (error) {
        console.log(`[ERROR] An error inside the command registry has occurred:\n ${error}`.red);
    }
}