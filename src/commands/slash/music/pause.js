const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("pause")
      .setDescription("Pauses a song"),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const { options, member, channel } = interaction;

        const queue = bot.distube.getQueue(interaction)
        if (!queue) return interaction.reply({
            content: `There is nothing in the queue right now!`
        })
        if (queue.paused) {
            queue.resume()
            return interaction.reply({ content: `Resumed :)` })
        }
        queue.pause()
        interaction.reply({
            content: `Music paused`
        })
    }}