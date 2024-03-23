const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const colors = require('../../../colors.json')

module.exports = {
    structure: {
        name: 'roleinfo',
        description: 'Displays role information',
        aliases: ['ri'],
        permissions: 'Administrator'
    },
    /**
     * @param {ExtendedClient} bot 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (bot, message, args) => {
        const embed = new EmbedBuilder()
        .setColor(colors.TRANSPARENT)
        .setDescription('**⌜   Staff Roles  ⌝**\n\n<@&756723869699670016> ▸ The one and only <:oasissunglassescool:1060144825090969620>\n<@&825974296663818250> ▸ The manager of the discord\n<@&934810508698214470> ▸ Veteran administrators of the discord entrusted with server development\n<@&756950808427364392> ▸ The administrators of the discord\n<@&757838930770001940> ▸ The moderators of the discord who ensure that all server rules are being followed\n<@&756950810578911372> ▸ Members that are being evaluated to become apart of the staff team\n<@&1006112607192756257> ▸ Oasis\'s custom bot coded by <@274021702411747328>!\n<@&903745069209751604> ▸ The moderators of Oasis\'s Twitch. **For discord related issues, do not contact twitch staff.**\n\n**⌜   Exclusive Roles  ⌝**\n\n<@&870057943398248478> ▸ Oasis\'s most notable members (usually from 2019 or prior) **Do not ask for this role.**\n<@&899003484949586020> ▸ The most recent winner of an event or tournament hosted previously\n<@&903745076398805082> ▸ For those who have made amazing fanart!\n<@&869916474448441405> ▸ For those that nitro boost the server\n\n**⌜   Leveling Roles  ⌝**\nThese roles depend on your <@1004762780508880986> bot rank **(>rank)**! The more active you are on the server, the more XP you gain to contribute towards your server level, making you move up a role!\n\n<@&756954432364609636> ▸ The basic starter rank granted upon joining.\n<@&757759380656750652> ▸ Granted at level 5\n<@&756953620288766074> ▸ Granted at level 10 **(Grants media perms)**\n<@&756953619882049616> ▸ Granted at level 15\n<@&756953619626197032> ▸ Granted at level 20\n<@&756953618896388126> ▸ Granted at level 25 **(Grants nickname perms)**\n<@&870113342222635049> ▸ Granted at level 30\n<@&870113470488670228> ▸ Granted at level 35\n<@&870113567377092618> ▸ Granted at level 40 **(Grants exclusive chat perms)**\n<@&903161806690877460> ▸ Granted at level 45\n<@&903162332593664030> ▸ Granted at level 50\n<@&903162402038759454> ▸ Granted at level 55\n<@&1048795955824185414> ▸ Granted at level 60\n<@&1048796299316695080> ▸ Granted at level 65\n<@&1048797646594248755> ▸ Granted at level 70\n<@&1048797870251327558> ▸ Granted at level 75 (There\'s no way you\'re gonna get this one...)')
        .setFooter({
            text: `${config.messageSettings.signature}`
        })

        const channel = bot.channels.cache.get(process.env.ROLE_CHANNEL)
        channel.send({
            files: [
                "./src/images/OASISroles.jpg"
            ]
        })

        setTimeout(function() {
            channel.send({
                embeds: [embed]
            })
        }, 5000)
    }
};