const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
    event: "emojiCreate",
    /**
     *
     * @param {ExtendedClient} bot
     * @param {Message} message
     * @returns
     */
    run: async (bot, emoji) => {
        const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
        const logChannel = staffServer.channels.cache.get(process.env.EMOJIS);

        const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiCreate });

        const entry = auditLog.entries.first()

        const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

        if(emoji.guild.id === staffServer.id) return;
        const log = new EmbedBuilder()
            .setAuthor({ name: `${executor.user.username}`, iconURL: executor.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Blue")
            .setDescription(`${executor} *(${executor.id})* created an emoji`)
            .addFields(
                { name: "Name", value: `${emoji.name}`},
                { name: "Emoji", value: `${emoji}` },
                { name: "ID", value: `${emoji.id}`},
            )
            .setTimestamp()

        logChannel.send({
            embeds: [log]
        })
    }}