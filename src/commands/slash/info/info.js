const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("discord.js");
const { sendReplyWithMention } = require('../../../utils/utils')
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require('../../../config')

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("info")
    .setDescription(
      "Gives specific information on a specific function of the server"
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription("Member to fetch. Leave blank to use on yourself.")
        .setRequired(false)),
  /**
   * @param {ExtendedClient} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const { options } = interaction;
    const choice = options.getString('category');

    let apiKey = "AIzaSyCS6OtPWTMBgeJPCp1ylptV2BMdLaYHYuo"
    let oasis = "UCUrQNbRe851N0MIVxOGZQjQ"

    const resolveYT = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${oasis}&key=${apiKey}`)
    const dataYT = await resolveYT.json()

    let subCount = dataYT["items"][0].statistics.subscriberCount;

    function kFormatter(num){
        const regExp = new RegExp('^-?\\d+(?:\.\\d{0,' + (1 || -1) + '})?');
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000)).toString().match(regExp)[0] + 'K' : Math.sign(num) * Math.abs(num);
    }

    let subCountReal = kFormatter(subCount);

    const resolveTWITCH = await fetch(`https://decapi.me/twitch/followcount/itsoasislive`)
    const dataTWITCH = await resolveTWITCH.json()

    let followerCount = kFormatter(dataTWITCH)

    const responses = new Map([
        ['levels', `### *Level System*
The leveling system here in ${interaction.guild.name} is unique to other servers, as it is completely custom. As you level up, you will start to gain more xp, getting you closer to that next level rank!\n\n**HOW IT WORKS** - Each user will gain a range of xp per minute. Once you gain xp, a timer will start, preventing you from gaining xp until after *one minute*, when the timer goes away. Some channels in the server are **XP disabled**, meaning you CANNOT gain xp in those channels. Looking in the channel topic will help determine if you can gain xp there or not. As you level up, you can gain perks! You can check out those perks in the <#903524420826591272> channel!\n\n**LEVEL MILESTONES** - These levels are the **milestones** of the server:\n\nLevel 5\nLevel 10\nLevel 15\nLevel 20\nLevel 25\nLevel 30\nLevel 35\nLevel 40\nLevel 45\nLevel 50\nLevel 55\nLevel 60\nLevel 65\nLevel 70\nLevel 75\nLevel 75\nLevel 80\nLevel 85+\n\nSome of those milestones comes with perks for you to enjoy for leveling up! More perks will come in the future! :)\n\nIf you have any questions, please open a ticket in <#903739112027197441> and a staff member will gladly help you!`],
        ['roles', `### *Roles*
        There are tons of roles in this server that define your profile here in ${interaction.guild.name}. Like content creators, artists, boosters, and more! \n\n**How do I get the creator/youtube role?**\n\nUse the </info:1220542774705655829> command (choose content creator)\n\n**How do I get roles like veteran, artists, and booster?**\n\nFor the <@&870057943398248478> role, you must have been a notable member from 2019 or prior. **DO NOT ASK FOR THIS ROLE**, it is non-obtainable.\n\nTo get the artist rank, you can create fanart and submit it in the <#903523861046394921> channel! **Must be original!**\n\nTo get the <@&869916474448441405> rank, you must boost the server at least once! (hint: if you have nitro, you get two free boosts :D)\n\n**How do I get moderator/admin?**\n\nFirst, you must wait until staff applications are open and you must meet the requirements listed! If your application is unique and well-written, you will be moving on the the interviews! Once you pass that, you get helper for a undisclosed amount of time! Then, you can work your way up by being a good influence on the community! The current staff ranks are: <@&756950810578911372>, <@&757838930770001940>, <@&756950808427364392>, <@&934810508698214470>, and <@&825974296663818250>! These can change at any time!`],
        ['oasis', `### *Oasis*
YouTube Subscribers: ${subCountReal}\nTwitch Followers: ${followerCount}\nOasis's Boundaries: [Click Here](https://oasisyt.carrd.co/#begin)\nMain YouTube: [Click Here](https://www.youtube.com/itsoasis)\nShorts Channel: [Click Here](https://www.youtube.com/channel/UCmyFKHoKqoJCEdi9qWbFORQ)\nMusic Channel: [Click Here](https://www.youtube.com/watch?v=b4hQknmOQWc)\n\nMore information will be here soon. Updates will be posted in the server.`],
        ['xp', `### *XP*
When sending messages throughout the server, you will earn between 15-25 XP towards your rank profile. You will get rewards by unlocking level milestones! To prevent spam, earning XP is limited to once a minute. You can view your rank by using the </rank:1215398887834124360> command in the <#903523421042929674> channel.`],
        ['sage', `### *Sage Bot*
Sage is a custom-coded bot for **${interaction.guild.name}**! It has some awesome features to keep the server safe!\n\n**A bit about the developer**\n\nThis bot is completely coded by <@274021702411747328>! IStay has been in this server a day after it was released, as well as being in the **OLD** server! He has been a friend of Oasis's for a long time now! <3 If you are ever having a hard time, his dms are always open to talk <3\n\n**Got suggestions?**\n\nIf you have any suggestions for this bot, DM istay!\n\n*Note: Please do not consider Sage as a scam bot, because it isn't! Sage will not ask for any account information or personal information, please watch for the bot tag and custom role icon, only exclusive to the bot itself!*`],
        ['content-creator', `### *Content Creator*
If you are sure you meet the requirements (see <#903524420826591272>), apply by creating a new ticket in <#903739112027197441>\n\n**⤷** <@&756952143776186460> role **requirements:**\n- For gaming channels with new Minecraft-focused content.\n- A reasonable number of views per video (500 or more views within a few days of release on all videos).\n- An active YouTube channel producing **__original content__** of a __reasonable quality.__\n\n**⤷** <@&896080274134286337> role **requirements:**\n-  For channels with new - though still some existing - Minecraft-focused content, but frequent gaming-focused content.\n-  A reasonable number of views per video (5000 or more views within a few days of release on all videos).\n- An active YouTube channel producing **__original content__** of a __reasonable quality.__\n\nNote: To be able to apply for either role, you must be a member of the discord server for a minimum of 45 days before applying. Shorts channels are handled on a case by case basis and will require significantly higher requirements than those listed above.\n\n**Please note that channels meeting these requirements are still not guaranteed a role. All creator roles are decided on a case by case basis following reviews and consideration by the administration team, and we may decline giving a rank for any reason.*`]
        
  ])

    if (interaction.member.roles.cache.has(process.env.STAFF_ROLE)) {
      sendReplyWithMention(interaction, responses.get(choice));
  } else {
      sendReplyWithMention(interaction, responses.get(choice), [], [], [], true);
  }
  },
};
