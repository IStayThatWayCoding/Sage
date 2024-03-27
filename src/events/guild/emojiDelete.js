const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
    event: "emojiDelete",
    /**
     *
     * @param {ExtendedClient} bot
     * @param {Message} message
     * @returns
     */
    run: async (bot, emoji) => {
        console.log(emoji)
        return;
        // fix later
        const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
        const logChannel = staffServer.channels.cache.get(process.env.EMOJIS);

        const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiDelete });

        const entry = auditLog.entries.first()

        const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

        if(emoji.guild.id === staffServer.id) return;
        const log = new EmbedBuilder()
            .setAuthor({ name: `${executor.user.username}`, iconURL: executor.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Red")
            .setDescription(`${executor} *(${executor.id})* deleted an emoji`)
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