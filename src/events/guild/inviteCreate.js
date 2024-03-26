const { EmbedBuilder } = require("discord.js");

module.exports = {
    event: "inviteCreate",
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

        if(invite.guild.id === staffServer.id) return;
        const log = new EmbedBuilder()
            .setAuthor({ name: `${invite.inviter.username}`, iconURL: invite.inviter.displayAvatarURL({ dynamic: true }) })
            .setColor("Blue")
            .setDescription(`<@${invite.inviter.id}> *(${invite.inviter.id})* created an invite`)
            .addFields(
                { name: "Invite Link", value: `${invite.url}`},
                { name: "Invite Code", value: `${invite.code}` },
                { name: "Invite Channel", value: `<#${invite.channel.id}>`},
                { name: "Created", value: `${invite.createdAt}`},
                { name: "Max Uses", value: `${invite.maxUses}` },
                { name: "Expires", value: `${invite.expiresAt}` },
                { name: "Temporary", value: `${invite.temporary}` }
            )

        logChannel.send({
            embeds: [log]
        })



    }} 