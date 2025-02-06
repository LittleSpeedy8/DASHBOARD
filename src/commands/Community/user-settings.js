const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const ms = require("ms");
const { QuickDB } = require("quick.db");
const db = new QuickDB()
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("user-settings")
        .setDescription("Your user settings for this bot.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('language')
                .setDescription('Change the bot language')
                .addStringOption(option => option.setName('languages').setDescription('Select the language.').setRequired(true).addChoices(
                    { name: 'English', value: 'english' },
                    { name: 'Spanish', value: 'spanish' },
                    { name: 'Dutch', value: 'dutch' },
                    { name: 'Swedish ', value: 'swedish' },
                ))),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction  
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction
        const command = options.getSubcommand()
        const lan = options.getString("languages")
        


        switch (command) {
            case "language":

            db.set(`lang-${interaction.guild.id}`, lan)
                interaction.reply({ content: `I have changed the language to **${lan}**.` })
        }
    }
}