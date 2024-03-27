const { readdirSync, readdir } = require('fs')
const ExtendedClient = require('../class/ExtendedClient')

/**
 * 
 * @param {ExtendedClient} bot
 */

module.exports = (bot) => {
    const guild = process.env.GUILD_ID
    

    setInterval(async () => {
        const resolve = await fetch("https://decapi.me/twitch/followcount/itsoasislive")
        const data = await resolve.JSON();
        const channel = bot.channels.cache.get("1214645737846214676")
        // channel.send(`${data}`);

        function kFormatter(num){
            const regExp = new RegExp('^-?\\d+(?:\.\\d{0,' + (1 || -1) + '})?');
            return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000)).toString().match(regExp)[0] + 'K' : Math.sign(num) * Math.abs(num);
        }

        let followerCount = kFormatter(data);

        let vc = bot.channels.cache.get("1006433607222575155")

        vc.setName(`Twitch: ${followerCount}`).catch(err => console.error(`${path.basename(__filename)} There was a problem changing the channel follower name: `, err))
    }, 600000)
}