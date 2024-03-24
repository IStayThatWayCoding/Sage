const { readdirSync, readdir } = require('fs')
const ExtendedClient = require('../class/ExtendedClient')

/**
 * 
 * @param {ExtendedClient} bot
 */

module.exports = (bot) => {
    const guild = bot.guilds.cache.get('755968485854675065')
    

    setInterval(async () => {
        const resolve = await fetch('https://discord.com/api/v9/guilds/755968485854675065?with_counts=true', { headers: { "Authorization": `Bot ${process.env.TOKEN}` } });
        const data = await resolve.json();
        
        const guild = bot.guilds.cache.get('755968485854675065')
        let totalOnline = data.approximate_presence_count;
        let memberCount = guild.memberCount;

        function kFormatter1(num) {
            const regExp = new RegExp('^-?\\d+(?:\.\\d{0,' + (1 || -1) + '})?');
            return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000)).toString().match(regExp)[0] + 'K' : Math.sign(num) * Math.abs(num);
        }
        function kFormatter2(num) {
            const regExp = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
            return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000)).toString().match(regExp)[0] + 'K' : Math.sign(num) * Math.abs(num);
        }

        let realOnline = kFormatter2(totalOnline);
        let realTotal = kFormatter1(memberCount);

        const channelOnline = guild.channels.cache.get("1006053954540544132")
        const channelTotal = guild.channels.cache.get("1006053923360100402")

        channelOnline.setName(`Online Members: ${realOnline}`).catch(err => console.error(`${path.basename(__filename)} There was a problem changing a channel's name: `, err));
        channelTotal.setName(`Discord Members: ${realTotal}`).catch(err => console.error(`${path.basename(__filename)} There was a problem changing a channel's name: `, err))
    
    }, 600000)
}