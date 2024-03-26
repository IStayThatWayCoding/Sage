const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder, codeBlock, Message, AuditLogEvent, Embed } = require('discord.js');

const protection = new Map()

module.exports = {
  event: "roleDelete",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {Message} message
   * @returns
   */
  run: async (bot, role) => {
    const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
    const logChannel = staffServer.channels.cache.get(process.env.ROLES);

    if(role.guild.id === staffServer.id) return;


    const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });

    const entry = auditLog.entries.first()

    const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

    const found = protection.get(entry.executor.id);

    const embed1 = new EmbedBuilder()
    .setAuthor({ name: `${executor.user.username}`, iconURL: executor?.user.displayAvatarURL({ dynamic: true }) })
    .setColor("Red")
    .setDescription(`**${role.name}** has been deleted by ${executor}`)
    .setFooter({ text: "Role Deleted" })

    logChannel.send({
        embeds: [embed1]
    })

    if (entry.executor.bot || entry.executor.id === process.env.OWNER_ID) return;

    if (found) {
        if (found >= 2) {
            const member = await guild.members.fetch(entry.executor.id).catch(() => { });

            member.roles.remove([process.env.STAFF_ROLE, '934810508698214470', '756950808427364392', '934810508698214470', '757838930770001940'])

            logChannel.send({
                 content: `<@&${process.env.STAFF_ROLE}>
**Mass Role Deletion Protection**
${member} was removed from the staff role to prevent a potential mass event`
            })
        } else {
            protection.set(entry.executor.id, found + 1);
        }
    } else {
        protection.set(entry.executor.id, 2);
        setTimeout(() => {
            protection.delete(entry.executor.id);
        }, 60000)
    }



  }}