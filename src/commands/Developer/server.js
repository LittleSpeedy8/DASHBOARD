const { PermissionsBitField, ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servers")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("Shows all the server the bot is in."),
     /**
     * 
     * @param {ChatInputCommandInteraction} interaction  
     * @param {Client} client 
     */
  async execute(interaction, client) {
    if (interaction.user.id !== "541379256878366746") return interaction.reply({ content: "Silly, this command is only for the owner." });
    else {
        const guilds = client.guilds.cache();
        const pageSize = 15; // Number of servers per page
        
        for (const guild of client.guilds.cache.array()) {
            console.log(guild.name);
        }
    }
  }
}