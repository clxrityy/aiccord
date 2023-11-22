const path = require("path");
const getFiles = require("./getFiles");

module.exports = (exceptions = []) => {
    let buttons = [];

    const buttonFiles = getFiles(path.join(__dirname, "..", "buttons"), true);

    for (const buttonFile of buttonFiles) {
        const buttonObject = require(buttonFile);

        if (exceptions.includes(buttonObject.name)) continue;
        buttons.push(buttonObject);
    }

    return buttons;
}