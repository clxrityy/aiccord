const path = require("path");
const getFiles = require("./getFiles");

module.exports = (exceptions = []) => {
    let localContextMenus = [];

    const menuFiles = getFiles(path.join(__dirname, "..", "contextMenus"), true);

    for (const menuFile of menuFiles) {
        const menuObject = require(menuFile);

        if (exceptions.includes(menuObject.name)) continue;
        localContextMenus.push(menuObject);
    }

    return localContextMenus;
}