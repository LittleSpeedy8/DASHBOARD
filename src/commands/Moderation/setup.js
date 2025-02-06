const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms")
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup your discord server!"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        let owner = await interaction.guild.fetchOwner()
        if (interaction.user.id !== owner.id) return interaction.reply({ content: `Only the guild owner can use this command.` });
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles || PermissionFlagsBits.Administrator)) return interaction.reply({ content: "I do not have permissions to edit roles." })

        const embed = new EmbedBuilder()
            .setTitle("Information")
            .setDescription("Please read this as this gives you info on how this works. \n  \n Ninja bot will remove and replace **CHANNLES, ROLES, and CATEGORYS**. \n NinjaBot will ask you few questions to setup the server.")

        const report = new ButtonBuilder()
            .setCustomId('report')
            .setLabel('Next')
            .setStyle(ButtonStyle.Success);
        const reportButton = new ActionRowBuilder()
            .addComponents(report)

    

        const sentMessage = interaction.reply({ embeds: [embed], components: [reportButton] })

        const filter = (interaction) => interaction.customId === 'report' && interaction.user.id === message.author.id;
        const collector = (await sentMessage).awaitMessageComponent({ filter, time: 15000 });
    
        collector.on('collect', (interaction) => {
          if (interaction instanceof ButtonInteraction) {
            const updatedEmbed = new MessageEmbed()
              .setTitle('Button Clicked')
              .setDescription('The button was clicked and the embed was edited.');
    
            interaction.edit({ embeds: [updatedEmbed], components: [] });
          }
        });
    
        collector.on('end', () => {
          sentMessage.edit({ components: [] });
        });
    }
}