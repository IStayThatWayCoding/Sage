
const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder, codeBlock, Message, AuditLogEvent, Embed } = require('discord.js');

const protection = new Map()

module.exports = {
  event: "channelDelete",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {Message} message
   * @returns
   */
  run: async (bot, channel) => {
    channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete
    })
    .then(async audit => {
      const entry = audit.entries.first()
      const guild = bot.guilds.cache.get(process.env.GUILD_ID)
      const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
      if (channel.guild == staffServer) return;

      const executor = await guild.members.fetch(entry.executor.id).catch(() => { });

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Forum";
      if (type == 5) type = "Announcement";
      if (type == 6) type = "Category";


      const logChannel = staffServer.channels.cache.get(process.env.CHANNELS);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({ name: `${executor.user.username}`, iconURL: executor?.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${name} *(${id})* was deleted by ${executor.user.username}`)
        .setFooter({ text: "Channel Deleted" })
      
        logChannel.send({
          embeds: [embed]
        })


    })

  }}