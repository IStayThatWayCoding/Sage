const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { sendResponse } = require('../../utils/utils');

module.exports = {
    customId: 'fanart-info',
    /**
     * 
     * @param {ExtendedClient} bot
     * @param {ButtonInteraction} interaction 
     */
    run: async (bot, interaction) => {
        await interaction.deferReply({ephemeral: true})

        const embed = new EmbedBuilder()
            .setColor("DarkPurple")
            .setTitle("Sending Fan Art")
            .setDescription("If you have any fan art that is **original** and that can be used in server-wide designs, such as logos and banners, post here! Be creative! If you have any questions, please contact staff.")

        sendResponse(interaction, ``, [embed], [], [], true)
    }
}