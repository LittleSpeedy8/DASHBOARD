const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const ms = require("ms")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Helps you with the bot like commands and things."),
    /**
   * 
   * @param {ChatInputCommandInteraction} interaction  
   * @param {Client} client 
   */
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle("information")
            .setDescription("I'm a bot that helps create servers and helps create them.")
    
            
        await interaction.reply({ embeds: [embed] })
    }
}