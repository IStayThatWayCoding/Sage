const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder } = require("discord.js");
const moment = require('moment')

module.exports = {
  event: "guildMemberRemove",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (bot, member) => {
    const guild = bot.guilds.cache.get(process.env.GUILD_ID);

    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
    const logChannel = staffServer.channels.cache.get(process.env.JOINANDLEAVE);

    if(member.guild.id === staffServer.id) return;

    let log = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({ name: `Member Left`, iconURL: member.displayAvatarURL({ dynamic: true })})
      .setDescription(`${member.user} ${member.user.username}`)
      .setFooter({ text: `ID: ${member.id}`})
      .setTimestamp()
    
    logChannel.send({
      embeds: [log]
    })

  }

}