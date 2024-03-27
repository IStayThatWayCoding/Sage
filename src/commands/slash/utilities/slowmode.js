const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    codeBlock,
    ChannelType,
    ButtonStyle,
    ComponentType,
    ActionRow,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
const { sendResponse } = require("../../../utils/utils");
  
  module.exports = {
    structure: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Sets the slowmode of a channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption((option =>
            option
                .setName("duration")
                .setDescription("The duration of the slowmode (seconds)")
                .setRequired(true)
        )
    )
        .addChannelOption((option =>
                option
                    .setName('channel')
                    .setDescription("The channel you want to set the slowmode for; leave blank for this one")
                    .setRequired(false)
                    .addChannelTypes(ChannelType.GuildText)
                )
    ),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        let { member, options, guild } = interaction;

        await interaction.deferReply({ ephemeral: true })

        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
        const logChannel = staffServer.channels.cache.get(process.env.CHANNELS);

        let channel = options.getChannel('channel') || interaction.channel
        let duration = options.getInteger('duration');

        var button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/${guild.id}/${channel.id}`)
                .setLabel(`Go to channel`)
        )


        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true}) })
            .setDescription(`⏲️ Slowmode enabled. Time intervals set to **${duration}** seconds for optimal communication flow.`)
            .setTimestamp()
        
        const log = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true}) })
            .setDescription(`${member} set the slowmode of \`${channel.name}\` for **${duration}** seconds`)
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp()
        
        channel.setRateLimitPerUser(duration).catch(err => {
            return;
        })

        await sendResponse(interaction, `${channel} slowmode set to ${duration} seconds!`)
        await channel.send({
            embeds: [embed]
        })
        await logChannel.send({
            embeds: [log],
            components: [button]
        })
    }}