const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder, codeBlock, Message, AuditLogEvent, Embed, embedLength } = require('discord.js');


module.exports = {
  event: "roleUpdate",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {Message} message
   * @returns
   */
  run: async (bot, oldRole, newRole) => {

    const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
    const logChannel = staffServer.channels.cache.get(process.env.ROLES);

    if(newRole.guild.id === staffServer.id) return;

    const auditLog = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate });

    const entry = auditLog.entries.first()

    const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

    const roleUpdatedEmbed = new EmbedBuilder()
        .setAuthor({ name: `${executor.user.username}`, iconURL: executor.user.displayAvatarURL({ dynamic: true}) })
        .setColor("Aqua")
        .setFooter({ text: `ID: ${newRole.id}` })
        .setTimestamp()
    
    
    if (oldRole.name !== newRole.name){
        roleUpdatedEmbed.addFields({ name: "Role Name", value: `${oldRole.name} → ${newRole.name}`})
    }

    if (oldRole.color !== newRole.color) {
        roleUpdatedEmbed.addFields({ name: "Color", value: `${oldRole.hexColor} → ${newRole.hexColor}`})
    }

    if (oldRole.hoist !== newRole.hoist) {
        roleUpdatedEmbed.addFields({ name: "Hoisted", value: `${oldRole.hoist} → ${newRole.hoist}`})
    }

    // if (oldRole.rawPosition !== newRole.rawPosition) {
    //     roleUpdatedEmbed.addFields({ name: "Raw Position (bottom to top)", value: `${oldRole.rawPosition} → ${newRole.rawPosition}`})
    // }

    const removedPerms = newRole.permissions.missing(oldRole.permissions)
    const addedPerms = oldRole.permissions.missing(newRole.permissions)
    let removedValue = `None`
    let addedValue = `None`

    if (addedPerms.length == 0){
        addedValue = `None`
    } else {
        addedValue = `${addedPerms.join(", ")}`
    }

    if (removedPerms.length == 0){
        
        removedValue = `None`
    } else {
        removedValue = `${removedPerms.join(", ")}`
    }


    if (oldRole.permissions !== newRole.permissions) {
        roleUpdatedEmbed.addFields(
            { name: "Added Permissions", value: `${addedValue}`},
            { name: "Removed Permissions", value: `${removedValue}`},
        )
    }
    
    if (oldRole.mentionable !== newRole.mentionable){
        roleUpdatedEmbed.addFields(
            { name: "Mentionable", value: `${oldRole.mentionable} → ${newRole.mentionable}`}
        )
    }

    logChannel.send({
        embeds: [roleUpdatedEmbed]
    })
            
    
  }}