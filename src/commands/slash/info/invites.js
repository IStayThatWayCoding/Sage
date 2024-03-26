const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    Embed,
  } = require("discord.js");
  const mongo = require('../../../handlers/mongoose')
  const ExtendedClient = require("../../../class/ExtendedClient");
  const path = require('path');
  const rankSchema = require('../../../schemas/rank-schem')
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("invites")
      .setDescription("Check how many invites you or someone else has ")
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription("Member to fetch. Leave blank to use on yourself.")
          .setRequired(false)),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const { member, options } = interaction;

        await interaction.deferReply()

        let target = options.getMember("user") || member;
        let targetID = target.user.id || member.id;

        let invites = await interaction.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === target.id);

        let i = 0; 
        userInv.forEach(inv => i += inv.uses);
        

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔍 Analysis Complete. ${target} currently possess **${i}** invites. ${target} must expand their network for optimal collaboration and efficiency.`)

        await interaction.editReply({
            embeds: [embed]
        })

    }}