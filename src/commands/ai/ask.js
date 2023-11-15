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
            return await interaction.editReply({ embeds: [embed(question, "I'm sorry I had an error...", true, 'https://i.gyazo.com/165d484ff60d7221c629f896c9533c0a.gif')] });
        }
        if (response === null) {
            return await interaction.editReply({ embeds: [embed(question, "**null**", true, 'https://i.gyazo.com/165d484ff60d7221c629f896c9533c0a.gif')] });
        }
        if (response === false) {
            return await interaction.editReply({ embeds: [embed(question, "I couldn't answer that, sorry!", true, 'https://i.gyazo.com/165d484ff60d7221c629f896c9533c0a.gif')] });
        }
        if (interaction.replied) {
            return;
        }
        if (interaction.deferred) {
            return await interaction.editReply({ embeds: [embed(question, response, false, 'https://i.gyazo.com/d60c7fd984baa6a66d1c65d0010bc9d4.png')] });
        }
        return;
    }

}