const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    customId: 'example-button',
    /**
     * 
     * @param {ExtendedClient} bot
     * @param {ButtonInteraction} interaction 
     */
    run: async (bot, interaction) => {

        await interaction.reply({
            content: 'The button has been successfully responded!',
            ephemeral: true
        });

    }
};