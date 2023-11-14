const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const query = require("../../lib/query");
const embed = require("../../util/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Ask me a question!")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The question you want to ask.")
        )
        .toJSON(),
    userPermissions: [PermissionsBitField.Flags.SendMessages],
    botPermissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ReadMessageHistory],
    run: async (client, interaction) => {
        const question = interaction.options.getString("question");

        await interaction.deferReply().catch(() => null);
        const response = await query(question);

        if (response === undefined) {
            return await interaction.editReply({ embeds: [embed(question, "I'm sorry I had an error...", true)] });
        }
        if (response === null) {
            return await interaction.editReply({ embeds: [embed(question, "**null**", true)] });
        }
        if (response === false) {
            return await interaction.editReply({ embeds: [embed(question, "I couldn't answer that, sorry!", true)] });
        }
        if (interaction.replied) {
            return;
        }
        if (interaction.deferred) {
            return await interaction.editReply({ embeds: [embed(question, response)] });
        }
        return;
    }

}