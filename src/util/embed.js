const { EmbedBuilder } = require("discord.js");
const { embedColorSuccess, embedColorError } = require("../config/messages.json");

module.exports = (title = '', description, error = false) => {
    let color = embedColorSuccess;
    if (error) {
        color = embedColorError;
    }

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
    
    return embed;
}