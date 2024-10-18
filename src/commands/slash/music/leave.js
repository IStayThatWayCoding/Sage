const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("leave")
      .setDescription("Leaves VC"),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const { options, member, channel } = interaction;

        bot.distube.voices.leave(interaction)

        interaction.reply({ content: `Left!` })
    }}