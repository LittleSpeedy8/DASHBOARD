const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js")
const ms = require("ms")
const { users, uptime } = require("../..")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Gives you info on the bot."),
    /**
   * 
   * @param {ChatInputCommandInteraction} interaction  
   * @param {Client} client 
   */
    async execute(interaction, client) {
        const name = client.user.username
        const icon = `${client.user.displayAvatarURL()}`
        const Users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
        const Servers = client.guilds.cache.reduce((acc, guild) => acc + 1, 0);

        let totalSeconds = (client.uptime / 1000)
        let days = Math.floor(totalSeconds / 864000)
        totalSeconds %= 86400
        let hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        let munutes = Math.floor(totalSeconds / 60)
        let seconds = Math.floor(totalSeconds % 60)

        let updatime = `${days} days, ${hours} hours, ${munutes} minutes & ${seconds} seconds`
        const embed = new EmbedBuilder()
            //   .setTitle("Help")
            .setDescription("I'm a bot that helps create servers and helps create them.")
            .setAuthor({ name: name, iconURL: icon })
            .setThumbnail(`${icon}`)
            .setFooter({ text: `©️ ${name}` })
            .addFields({ name: 'Servers', value: `${Servers}`, inline: true })
            .addFields({ name: 'Users', value: `${Users}`, inline: true })
            .addFields({ name: 'Uptime', value: `${updatime}`, inline: false })
            .addFields({ name: 'Ping', value: `${client.ws.ping}`, inline: false })


        await interaction.reply({ embeds: [embed] })
    }
}