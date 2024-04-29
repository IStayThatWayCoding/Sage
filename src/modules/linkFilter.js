const { readdirSync, readdir } = require('fs')
const ExtendedClient = require('../class/ExtendedClient')
const { Message, EmbedBuilder } = require('discord.js')

/**
 * 
 * @param {ExtendedClient} bot 
 * @param {Message} message
 */

module.exports = (bot, message) => {
    const inviteRegex = /(discord\.(gg|com|io|me|app\/invite)\/.+|discordapp\.com\/invite\/.+)/gi;
    const logChannel = bot.channels.cache.get(process.env.MESSAGE_CHANNEL)
    const allowed = [
        "473568312840814610",
        // "274021702411747328"
    ]

    if(allowed.includes(message.author.id)) return;

    if (inviteRegex.test(message.content)) {
        message.delete()
            // .then(msg => embed.setDescription(`Deleted message from ${msg.author.username}: ${msg}`))
            .then(msg => {
                const embed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setDescription(`Deleted message from ${msg.author.username}: ${msg.content}`);
                // Send the embed
                logChannel.send({ embeds: [embed] });
            })
            .catch(console.error);
        
        message.channel.send(`${message.author}, sending Discord invite links is not allowed here!`)
            .then(msg => {
                setTimeout(() => msg.delete(), 50000)
            })
            .catch(console.error);
    }

}