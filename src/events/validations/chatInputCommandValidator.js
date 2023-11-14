require("colors");
const { EmbedBuilder } = require("discord.js");
const { developersId, testGuildId } = require("../../config.json");
const msgConfig = require("../../config/messages.json");
const getLocalCommands = require("../../util/getLocalCommands");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand) return;

    const localCommands = getLocalCommands();
    const commandObject = localCommands.find((cmd) => cmd.data.name === interaction.commandName);

    if (!commandObject) return;

    const createEmbed = (color, description) => new EmbedBuilder().setColor(color).setDescription(description);

    if (commandObject.devOnly && !developersId.includes(interaction.member.id)) {
        const embed = createEmbed(msgConfig.embedColorError, msgConfig.commandDevOnly);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (commandObject.testMode && !interaction.guild.id !== testGuildId) {
        const embed = createEmbed(msgConfig.embedColorError, msgConfig.commandTestMode);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    for (const permission of commandObject.userPermissions || []) {
        if (!interaction.member.permissions.has(permission)) {
            const embed = createEmbed(msgConfig.embedColorError, msgConfig.userPermissions);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    const bot = interaction.guild.members.me;

    for (const permission of commandObject.botPermissions || []) {
        if (!bot.permissions.has(permission)) {
            const embed = createEmbed(msgConfig.embedColorError, msgConfig.botPermissions);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await commandObject.run(client, interaction)
        } catch (error) {
            console.log(`[ERROR] An error occurred inside the command validator:\n ${error}`.red);
        }
    }
}