const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
const { sendResponse } = require("../../../utils/utils");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("uptime")
      .setDescription("Returns uptime"),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {

        await interaction.deferReply()
        // add ephermeral if needed

        const days = Math.floor(bot.uptime / 86400000)
        const hours = Math.floor(bot.uptime / 3600000) % 24 // 1 Day = 24 Hours
        const minutes = Math.floor(bot.uptime / 60000) % 60 // 1 Hour = 60 Minutes
        const seconds = Math.floor(bot.uptime / 1000) % 60 // I Minute = 60 Seconds


        const uptimeEmbed = new EmbedBuilder()
            .setAuthor({ name: `Uptime of ${bot.user.username}`, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Fuchsia")
            .setDescription(`${bot.user.username} has been up for: \n\`${days}\` days \`${hours}\` hours \`${minutes}\` minutes \`${seconds}\` seconds`)

        await sendResponse(interaction, ``, [uptimeEmbed])
    }}