const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("Replays back pong"),
  async execute(interaction, client) {
    if (interaction.user.id !== "541379256878366746") return interaction.reply({ content: "Silly, this command is only for the owner." });
    else {
      interaction.reply("Please wait")
      setTimeout(async () => {
        await interaction.editReply({ content: `The bot has been shutdown.` })
        process.exit()
      }, 2000)
    }
  }
}