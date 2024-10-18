const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("nowplaying")
      .setDescription("Shows what's now playing!"),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const { options, member, channel } = interaction;
        const queue = bot.distube.getQueue(interaction);
        if (!queue) return interaction.reply({
            content: `There is nothing in queue.`
        })
        const song = queue.songs[0]

        interaction.reply({
            content: `Now Playing **\`${song.name}\` by ${song.user}`
        })
    }}