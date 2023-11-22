const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const imgQuery = require("../../lib/imgQuery");
const msgConfig = require("../../config/messages.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("caption")
        .setDescription("Send an image link and I will caption it!")
        .addStringOption((option) =>
            option.setName("image")
                .setDescription("Link to an image.")
                .setRequired(true)
        ).toJSON(),
    userPermissions: [PermissionsBitField.Flags.SendMessages],
    botPermissions: [PermissionsBitField.Flags.EmbedLinks],
    run: async (client, interaction) => {
        const image = interaction.options.getString("image");

        await interaction.deferReply().catch(() => null);

        const response = await imgQuery(image);

        const embed = new EmbedBuilder();

        if (response === undefined) {
            embed.setColor(msgConfig.embedColorError)
                .setDescription("I'm sorry, I had an error...")
                .setThumbnail('https://i.gyazo.com/165d484ff60d7221c629f896c9533c0a.gif');
            return await interaction.editReply({ embeds: [embed] });
        }
        if (response === null) {
            embed.setColor(msgConfig.embedColorError)
                .setDescription("`null`")
                .setThumbnail('https://i.gyazo.com/165d484ff60d7221c629f896c9533c0a.gif');
            return await interaction.editReply({ embeds: [embed] });
        }
        if (response === false) {
            embed.setColor(msgConfig.embedColorError)
                .setDescription("Invalid image!")
                .setThumbnail('https://i.gyazo.com/165d484ff60d7221c629f896c9533c0a.gif');
            return await interaction.editReply({ embeds: [embed] });
        }
        if (interaction.replied) {
            return;
        }
        if (interaction.deferred) {
            embed.setColor(msgConfig.embedColorDefault)
                .setDescription(response)
                .setImage(image);
            return await interaction.editReply({ embeds: [embed] });
        }
        return;
    }
}