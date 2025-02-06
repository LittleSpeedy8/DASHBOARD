const { SlashCommandBuilder } = require("@discordjs/builders")
const ms = require("ms")
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replays back pong"),
    async execute(interaction, client){
        await interaction.reply({content: `Pong`})
    }
}