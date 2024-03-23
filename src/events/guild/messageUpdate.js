const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const { EmbedBuilder, codeBlock, Message } = require('discord.js');


module.exports = {
  event: "messageUpdate",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {Message} message
   * @returns
   */
  run: async (bot, oldMessage, newMessage) => {
    if (oldMessage?.author?.bot) return;
    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
    if(oldMessage.guildId === process.env.STAFF_SERVER) return;

    const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    const logChannel = staffServer.channels.cache.get(process.env.MESSAGE_CHANNEL);

    let original = oldMessage?.content?.slice(0, 1000) + (oldMessage?.content?.length > 1000 ? '...' : '');
    let edited = newMessage?.content?.slice(0, 1000) + (newMessage?.content?.length > 1000 ? '...' : '');

    if (oldMessage?.cleanContent !== newMessage?.cleanContent) {
        let log = new EmbedBuilder()
            .setColor('#FF9E00')
            .setAuthor({ name: `${oldMessage?.author?.username}`, iconURL: oldMessage?.author?.displayAvatarURL({ dynamic: true }) })
            .setDescription(`[View Message](${newMessage?.url})`)
            .addFields({ name: `Author`, value: `${oldMessage?.author}`, inline: true },
                { name: `Channel`, value: `${oldMessage?.channel}`, inline: true },
                { name: `Old Message`, value: codeBlock(original), inline: false },
                { name: `New Message`, value: codeBlock(edited), inline: false })
            .setTimestamp()

        logChannel.send({
            embeds: [log]
        }).catch(err => console.error(err));
    }
  }

}