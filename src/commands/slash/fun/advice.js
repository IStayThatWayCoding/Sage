const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require('axios')
const getRandomUA = require('../../../utils/getRandomUA')

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('advice')
        .setDescription('Gives you advice <3'),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {

        await interaction.deferReply()

        const { data } = await axios('https://api.adviceslip.com/advice', {
            headers: {
                "User-Agent": getRandomUA(),
            },
        });

        const embed = new EmbedBuilder()
        .setColor(3092790)
        .setDescription(data.slip.advice)
        .setFooter({
            text: "Sage Advice | Made with 💖 by istay"
        })
        
        await interaction.followUp({
            embeds: [embed]
        })
    }
};

// const { data } = await axios('https://api.adviceslip.com/advice', {
//     headers: {
//         "User-Agent": getRandomUA(),
//     },
// });