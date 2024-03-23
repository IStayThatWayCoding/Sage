const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("apfp")
      .setDescription("Sets animated pfp")
      .addAttachmentOption(option => option.setName('avatar').setDescription("Attachment").setRequired(true)),
    //   .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    options: {
      developers: true,
    },
    
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {

        const { options } = interaction;
        const avatar = options.getAttachment('avatar');

        async function sendMessage(message){
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        var error;
        await bot.user.setAvatar(avatar.url).catch(async err => {
            error = true
            console.log(err);
            return await sendMessage(`Something went wrong.`)
        })
    }}