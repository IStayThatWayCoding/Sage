const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder, codeBlock, Message, AuditLogEvent } = require('discord.js');

const protection = new Map()

module.exports = {
  event: "roleDelete",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {Message} message
   * @returns
   */
  run: async (bot, oldMessage, newMessage) => {
    const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
    const logChannel = staffServer.channels.cache.get(process.env.ADMINWARNINGS);

    const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });

    const entry = auditLog.entries.first()
    if (entry.executor.bot || entry.executor.id === process.env.OWNER_ID) return;

    const found = protection.get(entry.executor.id);

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