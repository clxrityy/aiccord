const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const guildSchema = require("../../schemas/guild");
const msgConfig = require("../../config/messages.json");
const aiConfig = require("../../config/ai.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Your guild settings")
        .setDMPermission(false)
        .addSubcommand((sub) => sub
            .setName("system")
            .setDescription("System AI configuration")
            .addStringOption((option) => option
                .setName("role")
                .setDescription("The system role content (how the AI responds to questions/prompts)")
                .setMinLength(5)
                .setMaxLength(50)
            )
            .addNumberOption((option) => option
                .setName("temperature")
                .setDescription("The temperature of the AI")
                .setMinValue(0)
                .setMaxValue(1)
            )
        )
        .addSubcommand((sub) => sub
            .setName("view")
            .setDescription("View your guild's settings")
        )
        .addSubcommand((sub) => sub
            .setName("help")
            .setDescription("How to set your settings")
        )
        .addSubcommand((sub) => sub
            .setName("reset")
            .setDescription("Reset back to default settings")
        )
        .toJSON(),
    userPermissions: [PermissionsBitField.Flags.Administrator],
    botPermissions: [PermissionsBitField.Flags.SendMessages],
    run: async (client, interaction) => {
        const { options, guild, guildId } = interaction;

        const subCommand = options.getSubcommand();

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        let guildData = await guildSchema.findOne({ GuildID: guildId });

        if (!guildData) {
            guildData = new guildSchema({
                GuildID: guildId,
                Temperature: Number(aiConfig.temperature),
                SystemRoleContent: aiConfig.systemRoleContent,
                ImageRoleContent: aiConfig.imgSystemRoleContent
            })
            await guildData.save();
        }

        if (!["system", "view", "help", "reset"].includes(subCommand)) return;

        await interaction.deferReply().catch(() => null);

        switch (subCommand) {
            case "help":
                embed
                    .setColor(msgConfig.embedColorDefault)
                    .setTitle("⚙️ Settings")
                    .setDescription(`\`/settings system\`\n> /system settings \`role:\`Answer in a funny way. \`temperature:\`0.86\n\`/settings view\`\n\`/settings reset\`\nView [this page](https://platform.openai.com/docs/api-reference/chat/create) for more info on OpenAI.\n`)
                    .addFields(
                        { name: "Role", value: 'Instruct the AI on how to respond.' },
                        { name: "Temperature", value: "Between \`0\` and \`1\` \nHigher values make the output more random, while lower values make it more deterministic." },
                    );

                if (interaction.replied) return;
                if (interaction.deferred) {
                    return await interaction.editReply({ embeds: [embed], ephemeral: true });
                }
                break;
            case "view":
                embed
                    .setColor(msgConfig.embedColorDefault)
                    .setDescription(`**${guild.name}** settings \n`)
                    .setThumbnail(guild.iconURL())
                    .addFields(
                        { name: "Role", value: `${guildData.SystemRoleContent}` },
                        { name: "Temperature", value: `${(guildData.Temperature).toString()}` }
                    );
                if (interaction.replied) return;
                if (interaction.deferred) {
                    return await interaction.editReply({ embeds: [embed], ephemeral: true });
                }
                break;
            case "reset":
                await guildData.updateOne({
                    SystemRoleContent: aiConfig.systemRoleContent,
                    Temperature: Number(aiConfig.temperature)
                })
                await guildData.save();
                embed
                    .setColor(msgConfig.embedColorSuccess)
                    .setDescription(`Successfully reset **${guild.name}** back to default settings! \n \`/settings view\``);
                if (interaction.replied) return;
                if (interaction.deferred) {
                    return await interaction.editReply({ embeds: [embed], ephemeral: true });
                }
                break;
            case "system":
                const role = options.getString("role");
                const temperature = options.getNumber("temperature");
                
                if (role) {
                    await guildData.updateOne({
                        SystemRoleContent: role,
                    });
                }
                if (temperature || temperature > -1) {
                    await guildData.updateOne({
                        Temperature: temperature
                    });
                }
                await guildData.save();

                embed
                    .setColor(msgConfig.embedColorSuccess)
                    .setDescription("Successfully updated your guild settings! \n `/settings view`")

                if (interaction.replied) return;
                if (interaction.deferred) {
                    return await interaction.editReply({ embeds: [embed], ephemeral: true });
                }
                break;
        }
    }
}