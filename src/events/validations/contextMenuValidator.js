require("colors");
const { EmbedBuilder } = require("discord.js");
const { developersId, testGuildId } = require("../../config.json");
const msgConfig = require("../../config/messages.json");
const getLocalContextMenus = require("../../util/getLocalContextMenus");

module.exports = async (client, interaction) => {
    if (!getLocalContextMenus.isContextMenuCommand) return;

    const localContextMenus = getLocalContextMenus();
    const menuObject = localContextMenus.find((ctx) => ctx.data.name === interaction.commandName);

    if (!menuObject) return;

    const createEmbed = (color, description) => new EmbedBuilder().setColor(color).setDescription(description);

    if (menuObject.devOnly && !developersId.includes(interaction.member.id)) {
        const embed = createEmbed(msgConfig.embedColorError, msgConfig.commandDevOnly);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (menuObject.testMode && !interaction.guild.id !== testGuildId) {
        const embed = createEmbed(msgConfig.embedColorError, msgConfig.commandTestMode);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    for (const permission of menuObject.userPermissions || []) {
        if (!interaction.member.permissions.has(permission)) {
            const embed = createEmbed(msgConfig.embedColorError, msgConfig.userPermissions);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    const bot = interaction.guild.members.me;

    for (const permission of menuObject.botPermissions || []) {
        if (!bot.permissions.has(permission)) {
            const embed = createEmbed(msgConfig.embedColorError, msgConfig.botPermissions);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await menuObject.run(client, interaction)
        } catch (error) {
            console.log(`[ERROR] An error occurred inside the command validator:\n ${error}`.red);
        }
    }
}