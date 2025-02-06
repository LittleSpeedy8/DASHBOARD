const { Interaction, Collection, EmbedBuilder, Client } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const { cooldowns } = client;

        const command = client.commands.get(interaction.commandName);

        if (!command) return

      
        

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }

    },



};