const { EmbedBuilder } = require("discord.js");
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

module.exports = {
    event: "voiceStateUpdate",
    /**
     *
     * @param {ExtendedClient} bot
     * @param {Message} message
     * @returns
     */
    run: async (bot, oldState, newState) => {
        // console.log(oldState)
        // console.log(newState)

        const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    
        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
        const logChannel = staffServer.channels.cache.get(process.env.VOICE);

        if(oldState.guild.id === staffServer.id) return;


        const user = oldState.guild.members.cache.get(oldState.id)
        // console.log(user)

        const log = new EmbedBuilder()
            .setAuthor({ name: `${user.user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `ID: ${user.id}`})
            .setTimestamp()

        if(oldState.channelId === null) {
            log.setDescription(`${user} joined voice channel <#${newState.channelId}>`)
            log.setColor("Green")
            logChannel.send({
                embeds: [log]
            })
        } else if (newState.channelId === null) {
            log.setDescription(`${user} left voice channel <#${oldState.channelId}>`)
            log.setColor("Red")
            logChannel.send({
                embeds: [log]
            })
        } else if (oldState.channelId !== newState.channelId) {
            log.setDescription(`${user} switched voice channels from <#${oldState.channelId}> → <#${newState.channelId}>`)
            log.setColor("Blurple")
            logChannel.send({
                embeds: [log]
            })
        }



    }}