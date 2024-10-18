const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Plays a song")
      .addStringOption((option => 
        option
            .setName("content")
            .setDescription("What you want to play")
            .setRequired(true)
        )),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        interaction.deferReply()
        
        const { options, member, channel } = interaction;

        let url = options.getString('content')

        bot.distube.play(member.voice.channel, url, {
            member: member,
            textChannel: channel,
            interaction
        })
    }}