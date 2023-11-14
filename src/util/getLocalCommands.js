const path = require("path");
const getFiles = require("./getFiles");

module.exports = (exceptions = []) => {
    let localCommands = [];

    const commandCategories = getFiles(path.join(__dirname, "..", "commands"), true);

    for (const commandCategory of commandCategories) {
        const commandFiles = getFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile);

            if (exceptions.includes(commandObject.name)) continue;
            localCommands.push(commandObject);
        }
    }

    return localCommands;
}