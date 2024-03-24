const { readdirSync, readdir } = require('fs')
const ExtendedClient = require('../class/ExtendedClient')

/**
 * 
 * @param {ExtendedClient} bot
 */

module.exports = (bot) => {

    setInterval(async () => {

        let apiKey = "AIzaSyCS6OtPWTMBgeJPCp1ylptV2BMdLaYHYuo"
        let oasis = "UCUrQNbRe851N0MIVxOGZQjQ"

        const resolve = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${oasis}&key=${apiKey}`)
        const data = await resolve.json();
        const channel = bot.channels.cache.get("1214645737846214676")
        // console.log(data);

        let subCount = data["items"][0].statistics.subscriberCount;

        function kFormatter(num){
            const regExp = new RegExp('^-?\\d+(?:\.\\d{0,' + (1 || -1) + '})?');
            return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000)).toString().match(regExp)[0] + 'K' : Math.sign(num) * Math.abs(num);
        }
        const guild = bot.guilds.cache.get("755968485854675065")
        let subCountReal = kFormatter(subCount);

        let vc = guild.channels.cache.get("1006053870293753937");

        vc.setName(`YouTube: ${subCountReal}`).catch(err => console.error(`${path.basename(__filename)} There was a problem changing the channel sub name: `, err))

    }, 3000)
}