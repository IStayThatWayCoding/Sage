const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    codeBlock
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
const { sendResponse } = require("../../../utils/utils");
  
  module.exports = {
    structure: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlocks a channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption((option =>
                option
                    .setName('channel')
                    .setDescription("The channel to unlock")
                    .setRequired(true)
                ))
        .addStringOption((option =>
                option
                    .setName("reason")
                    .setDescription("The reason for locking the channel")
                    .setRequired(true)
            )
        ),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        let { member, options } = interaction;

        await interaction.deferReply({ ephemeral: true })

        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
        const logChannel = staffServer.channels.cache.get(process.env.LOCK_UNLOCK);

        let channel = options.getChannel('channel');
        let reason = options.getString('reason')
        if (!reason) reason = "No Reason Specified"

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true })

        const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true}) })
            .setDescription(`🔒 ${channel} unlocked. Normal operations restored by ${member} for continued efficiency.\n\n**Reason:** ${codeBlock(reason)}`)
            .setTimestamp()
        
        const log = new EmbedBuilder()
            .setColor("DarkGreen")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true}) })
            .setDescription(`${member} unlocked ${channel} for \`${reason}\``)
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp()

        await sendResponse(interaction, `${channel} unlocked!`)
        await channel.send({
            embeds: [embed]
        })
        await logChannel.send({
            embeds: [log]
        })


        
    }}