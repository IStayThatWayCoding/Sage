const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder, AuditLogEvent, codeBlock } = require('discord.js');
const { uuid } = require('uuidv4')
const { ImgurClient } = require('imgur')

function get64bin(int) {
    if (int >= 0) {
        return int.toString(2).padStart(64, "0");
    } else {
        return (-int - 1).toString(2).replace(/[01]/g, d => +!+d).padStart(64, "1");
    }
}

module.exports = {
    event: "messageDelete",
    /**
     *
     * @param {ExtendedClient} bot
     * @param {Message} message
     * @returns
     */
    run: async (bot, message) => {
        
        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
        if(message.guild === staffServer) return;

        const guild = bot.guilds.cache.get(process.env.GUILD_ID);
        const logChannel = staffServer.channels.cache.get(process.env.MESSAGE_CHANNEL);

        setTimeout(async () => {
            const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MessageDelete });
            const entry = fetchedLogs.entries.first()
            const binary = get64bin(parseInt(entry.id)).slice(0, 42);
            const decimalEpoch = parseInt(binary, 2) + 1420070400000;
            const timestamp = Date.parse(new Date(decimalEpoch));


            const log = new EmbedBuilder()
            .setAuthor({ name: `${message?.author.username}`, iconURL: message?.author.displayAvatarURL({ dynamic: true }) })
            .setColor("#E04F5F")
            .addFields({ name: `Author`, value: `${message?.author?.username}`, inline: true },
                { name: `Channel`, value: `${message?.channel}`, inline: true })
            .setFooter({ text: `Delete • ${uuid()}`})
            .setTimestamp()

            let content = message?.content;
            if (message?.content.length > 1000) content = message?.content.slice(0, 1000) + '...';

            if (content) log.addFields({ name: `Message`, value: codeBlock(content), inline: false });

            if ((new Date() - timestamp) < 10000) {
                const executor = await guild.members.fetch(entry.executor.id).catch(() => { });
                log.setAuthor({ name: `${executor?.user.username}`, iconURL: executor?.user.displayAvatarURL({ dynamic: true }) })
            }

            let msgAttachment = message?.attachments.size > 0 ? message?.attachments.first().url : null;

            if (msgAttachment) {
                // Create a new imgur client
                const imgur = new ImgurClient({ clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET });
                // Upload attachment to imgur, get the link and attach it to the embed
                const response = await imgur.upload({
                    image: msgAttachment,
                }).catch(err => console.error(`There was a problem uploading an image to imgur: `, err));
                // If there was a problem uploading the image, don't attach it to the embed
                if (!response || response.status !== 200) return;
                log.setImage(response.data.link);
            }

            logChannel.send({
                embeds: [log]
            }).catch(err => console.error(err))

        }, 2000);

        if (message?.channel.isThread()) {
            const starterMessage = await message?.channel.fetchStarterMessage().catch(() => { });
            // Delete the thread if the starter message was deleted and there are no other messages in the thread
            if (!starterMessage && message?.channel.messageCount === 0) {
                message?.channel.delete().catch(err => console.error(`There was a problem deleting a thread channel: `, err));
            }
            // Archive and lock the thread if the starter message was deleted but there are messages in the thread
            if (!starterMessage && message?.channel.messageCount > 0) {
                message?.channel.edit({
                    archived: true,
                    locked: true
                }).catch(err => console.error(`There was a problem deleting a thread channel: `, err));
            }}

    }}