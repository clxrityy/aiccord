require("colors");
const { EmbedBuilder } = require("discord.js");
const { developersId, testGuildId } = require("../../config.json");
const msgConfig = require("../../config/messages.json");
const getButtons = require("../../util/getButtons");

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const buttons = getButtons();
    const buttonObject = buttons.find((btn) => btn.data.name === interaction.commandName);

    if (!buttonObject) return;

    const createEmbed = (color, description) => new EmbedBuilder().setColor(color).setDescription(description);

    if (buttonObject.devOnly && !developersId.includes(interaction.member.id)) {
        const embed = createEmbed(msgConfig.embedColorError, msgConfig.commandDevOnly);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (buttonObject.testMode && !interaction.guild.id !== testGuildId) {
        const embed = createEmbed(msgConfig.embedColorError, msgConfig.commandTestMode);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    for (const permission of buttonObject.userPermissions || []) {
        if (!interaction.member.permissions.has(permission)) {
            const embed = createEmbed(msgConfig.embedColorError, msgConfig.userPermissions);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    const bot = interaction.guild.members.me;

    for (const permission of buttonObject.botPermissions || []) {
        if (!bot.permissions.has(permission)) {
            const embed = createEmbed(msgConfig.embedColorError, msgConfig.botPermissions);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.message.interaction) {
            if (interaction.message.interaction.user.id !== interaction.user.id) {
                const embed = new EmbedBuilder()
                    .setColor(`${msgConfig.embedColorError}`)
                    .setDescription(`${msgConfig.cannotUseButton}`)
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        }

        try {
            await buttonObject.run(client, interaction)
        } catch (error) {
            console.log(`[ERROR] An error occurred inside the command validator:\n ${error}`.red);
        }
    }
}