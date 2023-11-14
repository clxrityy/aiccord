const path = require("path");
const getFiles = require("../util/getFiles");

module.exports = (client) => {
    const eventFolders = getFiles(path.join(__dirname, "..", "events"), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getFiles(eventFolder);

        let eventName;

        eventName = eventFolder.replace(/\\/g, '/').split("/").pop();

        eventName === "validations" ? (eventName = "interactionCreate") : eventName;

        client.on(eventName, async (args) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, args);
            }
        })
    }
}