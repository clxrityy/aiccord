const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test if we workin'")
        .setDMPermission(false)
        .addSubcommandGroup(
            (subcommandGroup) =>
                subcommandGroup
                    .setName("user")
                    .setDescription("Configure a user")
                    .addSubcommand((subCommand) =>
                        subCommand
                            .setName("role")
                            .setDescription("Configure a user's role")
                            .addUserOption((option) =>
                                option
                                    .setName("user")
                                    .setDescription("The user to configure"))
                    )
                    .addSubcommand((subCommand) =>
                        subCommand
                            .setName("nickname")
                            .setDescription("Configure a user's nickname")
                            .addStringOption((option) =>
                                option
                                    .setName("nickname")
                                    .setDescription("The nickname the user should have."))
                            .addUserOption((option) =>
                                option
                                    .setName("user")
                                    .setDescription("The user to configure"))
                    )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("message")
                .setDescription("Configure a message")
    )
        .toJSON(),
    userPermissions: [PermissionsBitField.Flags.ManageMessages],
    botPermissions: [PermissionsBitField.Flags.Connect],
    
    run: (client, interaction) => {
        return interaction.reply("testing");
    }
}