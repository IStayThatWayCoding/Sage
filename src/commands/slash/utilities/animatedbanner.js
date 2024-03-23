const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    Routes,
    DataResolver,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("banner")
      .setDescription("Add/remove/list warning(s) from a user.")
      .addAttachmentOption(option => option.setName('banner').setDescription("Attachment").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    options: {
      developers: true,
    },
    
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {

        const { options } = interaction;
        const banner = options.getAttachment('banner');

        async function sendMessage(message){
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        var error;
        await bot.rest.patch(Routes.user(), {
            body: { banner: await DataResolver.resolveImage(banner.url)}
        }).catch(async err => {
            error = true;
            await sendMessage(`An error occured.`)
        })
        
        if (error) return;

        await sendMessage('Done!')
    }}