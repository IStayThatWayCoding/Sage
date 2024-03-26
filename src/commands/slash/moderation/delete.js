const { SlashCommandBuilder, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { sendResponse } = require('../../../utils/utils')
const { uuid } = require('uuidv4');
const ExtendedClient = require('../../../class/ExtendedClient')

/**
 * Filter and bulk delete messages based on a user or all non-system messages
 * @param {ExtendedClient} bot
 * @param {Object} interaction The interaction object
 * @param {TextChannel} channel - The channel to fetch messages from and delete them
 * @param {Collection<Snowflake, Message>} messages - The messages to filter and delete
 * @param {Object} user The user object to filter the messages by
 * @param {number} amount The maximum number of messages to delete
 */

module.exports = {
    structure: new SlashCommandBuilder()
      .setName("delete")
      .setDescription("Delete messages from a channel or user")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addNumberOption((option => 
        option
            .setName('amount')
            .setDescription('Number of messages to delete')
            .setRequired(true)
        ))
    .addUserOption((option =>
        option
            .setName('username')
            .setDescription('Delete a specific user\'s messages')
            .setRequired(false)
        )),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    
    run: async (bot, interaction) => {
        async function bulkDeleteFilteredMessages(interaction, channel, messages, user, amount) {
            let i = 0;
            const filtered = [];
            messages.filter(message => {
                (user ? message.author.id === user.id : !message.system) && amount > i ? (filtered.push(message), i++) : null;
            });
            const bulkDelete = await channel.bulkDelete(filtered, true).catch(err => console.error(`There was a problem deleting a message: `, err))
            const responseWithUser = `🗑️ Extraneous data purged to optimize system performance. ${bulkDelete.size} messages from ${user} removed in ${channel} for streamlined operation.`;
            const responseWithoutUser = `🗑️ Extraneous data purged to optimize system performance. ${bulkDelete.size} messages have been removed in ${channel} for streamlined operation.`;
            sendResponse(interaction, `${user ? responseWithUser : responseWithoutUser}`);
            return bulkDelete.size;
        }

        const { guild, member, channel, options } = interaction;

        await interaction.deferReply({ ephemeral: true }).catch(err => console.error(err))

        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
        const logChannel = staffServer.channels.cache.get(process.env.MESSAGE_CHANNEL);

        const amountToDelete = options.getNumber('amount');
        const user = options.getMember('username');
        const fetchedMessages = await channel.messages.fetch().catch(() => { });

        if (!guild.members.me.permissionsIn(channel).has('ManageMessages') || !guild.members.me.permissionsIn(channel).has('SendMessages') || !guild.members.me.permissionsIn(channel).has('ViewChannel'))
            return sendResponse(interaction, `Missing permissions for ${channel}`)

        if (fetchedMessages.size < 1)
            return sendResponse(interaction, `I could not find any messages from ${user} in ${channel}`);

        if (amountToDelete < 1 && member.id === process.env.OWNER_ID || amountToDelete > 100 && member.id === process.env.OWNER_ID)
            return sendResponse(interaction, `Amount must be between 1 and 100`);

        if (amountToDelete < 1 || amountToDelete > 5 && member.id !== process.env.OWNER_ID)
            return sendResponse(interaction, `Amount must be between 1 and 5`);

        if (!user && member.id !== process.env.OWNER_ID)
            return sendResponse(interaction, `You must include a username`);

        const deletedSize = await bulkDeleteFilteredMessages(interaction, channel, fetchedMessages, user, amountToDelete);

        // Log
        let log = new EmbedBuilder()
            .setAuthor({ name: `${member?.user.username}`, iconURL: member?.user.displayAvatarURL({ dynamic: false }) })
            .setColor("DarkButNotBlack")
            .addFields({ name: `Channel`, value: `${channel}`, inline: true },
                { name: `Reason`, value: `Bulk deleted ${deletedSize} messages`, inline: true })
            .setFooter({ text: `Bulk Delete • ${uuid()}`})
            .setTimestamp()
        
        logChannel.send({
            embeds: [log]
        }).catch(err => console.error(err));

    }}