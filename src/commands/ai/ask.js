const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const query = require("../../lib/query");

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

        const response = await query(question);

        if (response === undefined) {
            return await interaction.reply("I'm sorry I had an error...")
        }
        if (response === null) {
            return await interaction.reply("null");
        }
        if (response === false) {
            return await interaction.reply("I couldn't answer that, sorry!")
        }

        await interaction.deferReply();
        return await interaction.editReply(response);
    }
}