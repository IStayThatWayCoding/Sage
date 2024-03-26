const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
    event: "inviteDelete",
    /**
     *
     * @param {ExtendedClient} bot
     * @param {Message} message
     * @returns
     */
    run: async (bot, invite) => {

        const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
        const logChannel = staffServer.channels.cache.get(process.env.INVITES);

        const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.InviteDelete });

        const entry = auditLog.entries.first()
    
        const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

        if(invite.guild.id === staffServer.id) return;
        const log = new EmbedBuilder()
            .setAuthor({ name: `${executor.user.username}`, iconURL: executor.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Blue")
            .setDescription(`${executor} *(${executor.user.id})* deleted an invite`)
            .addFields(
                { name: "Invite Link", value: `${invite.url}`},
                { name: "Invite Code", value: `${invite.code}` },
                { name: "Invite Channel", value: `<#${invite.channel.id}>`},
             )

        logChannel.send({
            embeds: [log]
        })



    }} 