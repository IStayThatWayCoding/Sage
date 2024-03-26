const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder, codeBlock, Message, AuditLogEvent, Embed } = require('discord.js');


module.exports = {
  event: "roleCreate",
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

    const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate });

    const entry = auditLog.entries.first()

    const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

    const embed1 = new EmbedBuilder()
    .setAuthor({ name: `${executor.user.username}`, iconURL: executor?.user.displayAvatarURL({ dynamic: true }) })
    .setColor("Green")
    .setDescription(`**${role.name}** has been created by ${executor}`)
    .setFooter({ text: "Role Created" })

    logChannel.send({
        embeds: [embed1]
    })

}}