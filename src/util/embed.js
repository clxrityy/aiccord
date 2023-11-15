const { EmbedBuilder } = require("discord.js");
const { embedColorSuccess, embedColorError } = require("../config/messages.json");

module.exports = (title = '', description, error = false, image = '') => {
    let color = embedColorSuccess;
    if (error) {
        color = embedColorError;
    }

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(image.length > 1 ? image : null)
    
    return embed;
}