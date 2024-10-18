const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Shows queue"),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const { options, member, channel } = interaction;

        const queue = bot.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: `Nothing is playing` })
        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join('\n')
        interaction.reply({
            content: `Server Queue:\n${q}`
        })
    }}