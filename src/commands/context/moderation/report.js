const { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { sendResponse } = require('../../../utils/utils');
const colors = require('../../../colors.json')
const { uuid } = require('uuidv4')
module.exports = {
    structure: new ContextMenuCommandBuilder()
        .setName('Report Message')
        .setType(ApplicationCommandType.Message),
    /**
     * @param {ExtendedClient} bot
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const { member, guild, channel } = interaction;

        await interaction.deferReply({ ephemeral: true })

        const fetchMessage = await channel.messages.fetch(interaction.targetId);
        const target = fetchMessage.author;
        const reportId = uuid();
        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
        const logChannel = staffServer.channels.cache.get(process.env.REPORTS_CHANNEL);

        let reportEmbed = new EmbedBuilder()
            .setColor("DarkRed")
            .setAuthor({ name: `${member?.user.username}`, iconURL: member?.displayAvatarURL({ dynamic: true}) })
            .addFields(
                { name: `Reported User`, value: `${target}`, inline: false},
                { name: `Reported Content`, value: codeBlock(fetchMessage?.content), inline: false }
            )
            .setFooter({ text: `ID: ${member?.id}`, iconURL: guild.iconURL({ dynamic: true }) })
            .setTimestamp()

        const viewMessage = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${fetchMessage.url}`)
                        .setLabel(`View Message`)
                )
        
        const reportMessage = await logChannel.send({
            content: `<@&${process.env.STAFF_SERVER_ROLE}>`,
            //content: `ping role`,
            embeds: [reportEmbed],
            components: [viewMessage]
        })

        reportEmbed = new EmbedBuilder(reportEmbed)
            .setFooter({ text: `ID: ${member?.id}-${reportMessage.id}`, iconURL: guild.iconURL({ dynamic: true }) })
        reportMessage.edit({ embeds: [reportEmbed] })

        sendResponse(interaction, `<:report:1222279772113993828> Your contribution to server security is noted. Report successfully logged for staff review. Efficiency in action.`)
    }}