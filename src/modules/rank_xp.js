const Discord = require("discord.js");
const mongo = require("../handlers/mongoose");
const rankSchema = require("../schemas/rank-schem");
const path = require("path");
const xpLimit = new Set();
const ExtendedClient = require("../class/ExtendedClient");
const { dbFind, dbCreate, dbUpdateOne } = require("../utils/utils");
const colors = require("../colors.json");
const RANK = require("../schemas/rank-schem");

/**
 * Random number
 * @param {Object} message Message object
 */


function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min - 1) + min);
}

/**
 *
 * @param { Message } message
 * @param { ExtendedClient } bot
 */

const disableXP = [
  "903867173150294036",
  "903523881090945116",
  "903853974661247036",
  "903578658986418197",
  "903523553222230106",
  "903523421042929674",
  "903864384357543978",
  "1007900121700257822",
];

module.exports = async (bot, message) => {
  const guild = bot.guilds.cache.get(process.env.GUILD_ID);
  const LVLCHANNEL = guild.channels.cache.get(process.env.LVLUP);
  const disableXP = [process.env.BOT_CHAN];

  let userRankData;
  if (!message?.author?.bot && !xpLimit.has(message?.author?.id)) {
    // If the message is in an XP disabled channel, don't add XP
    if (disableXP.includes(message?.channel?.id)) return;
    // Fetch the user's database entry
    userRankData = await dbFind(rankSchema, { id: message?.author?.id });
    // Check to see if the user is in our database yet, if not, add them
    if (userRankData.length === 0) {
      await dbCreate(rankSchema, {
        rank: 0,
        id: message?.author?.id,
        username: message?.author.username,
        avatar: message?.author.avatar,
        level: 0,
        msgCount: 0,
        xp: 0,
        xxp: 0,
        xxxp: 100,
      });
      // Fetch the new created database entry for the user
      userRankData = await dbFind(rankSchema, { id: message?.author?.id });
    }

    for (const data of userRankData) {
      const { xp, xxp, xxxp, level } = data;

      const random = randomNum(15, 25);
      let xpMath =  parseInt(xp) + random;
      let xxpMath = parseInt(xxp) + random;

      const xxxpInt = parseInt(xxxp);
      const newUsername = message?.author?.username;

      // Update user's xp and xxp every message, once every 60 seconds
      await dbUpdateOne(
        rankSchema,
        { id: message?.author?.id },
        {
          username: newUsername,
          avatar: message?.author.avatar,
          xp: xpMath,
          xxp: xxpMath,
        }
      );

      // When a user ranks up, we reset their 'xxp'(level starting xp) to '0' and exponentially increase their 'xxxp'(xp needed until next rank)
      if (xxpMath > xxxpInt) {
        const levelMath = parseInt(level) + 1;
        // The amount to increase the user's xp by
        const exponential =
          5 * Math.pow(levelMath, 2) + 50 * levelMath + 100 - 0;
        // Update the user's database entry
        await dbUpdateOne(
          rankSchema,
          { id: message?.author?.id },
          { level: levelMath, xp: xpMath, xxp: 0, xxxp: exponential }
        );
        // Add and/or remove the appropriate rank roles for the user
        try {
          const lvl5 = guild.roles.cache.get(process.env.LVL5);
          const lvl10 = guild.roles.cache.get(process.env.LVL10);
          const lvl15 = guild.roles.cache.get(process.env.LVL15);
          const lvl20 = guild.roles.cache.get(process.env.LVL20);
          const lvl25 = guild.roles.cache.get(process.env.LVL25);
          const lvl30 = guild.roles.cache.get(process.env.LVL30);
          const lvl35 = guild.roles.cache.get(process.env.LVL35);
          const lvl40 = guild.roles.cache.get(process.env.LVL40);
          const lvl45 = guild.roles.cache.get(process.env.LVL45);
          const lvl50 = guild.roles.cache.get(process.env.LVL50);
          const lvl55 = guild.roles.cache.get(process.env.LVL55);
          const lvl60 = guild.roles.cache.get(process.env.LVL60);
          const lvl65 = guild.roles.cache.get(process.env.LVL65);
          const lvl70 = guild.roles.cache.get(process.env.LVL70);
          const lvl75 = guild.roles.cache.get(process.env.LV75);
          const lvl80 = guild.roles.cache.get(process.env.LVL80);
          const lvl85 = guild.roles.cache.get(process.env.LVL85);
          if (levelMath === 5) {
            message.member?.roles.add(lvl5);
          }
          if (levelMath === 10) {
            message?.member?.roles.add(lvl10);
            message?.member?.roles.remove(lvl5);
          }
          if (levelMath === 15) {
            message?.member?.roles.add(lvl15);
            message?.member?.roles.remove(lvl10);
          }
          if (levelMath === 20) {
            message?.member?.roles.add(lvl20);
            message?.member?.roles.remove(lvl15);
          }
          if (levelMath === 25) {
            message?.member?.roles.add(lvl25);
            message?.member?.roles.remove(lvl20);
          }
          if (levelMath === 30) {
            message?.member?.roles.add(lvl30);
            message?.member?.roles.remove(lvl25);
          }
          if (levelMath === 35) {
            message?.member?.roles.add(lvl35);
            message?.member?.roles.remove(lvl30);
          }
          if (levelMath === 40) {
            message?.member?.roles.add(lvl40);
            message?.member?.roles.remove(lvl35);
          }
          if (levelMath === 45) {
            message?.member?.roles.add(lvl45);
            message?.member?.roles.remove(lvl40);
          }
          if (levelMath === 50) {
            message?.member?.roles.add(lvl50);
            message?.member?.roles.remove(lvl45);
          }
          if (levelMath === 55) {
            message?.member?.roles.add(lvl55);
            message?.member?.roles.remove(lvl50);
          }
          if (levelMath === 60) {
            message?.member?.roles.add(lvl60);
            message?.member?.roles.remove(lvl55);
          }
          if (levelMath === 65) {
            message?.member?.roles.add(lvl65);
            message?.member?.roles.remove(lvl60);
          }
          if (levelMath === 70) {
            message?.member?.roles.add(lvl70);
            message?.member?.roles.remove(lvl65);
          }
          if (levelMath === 75) {
            message?.member?.roles.add(lvl75);
            message?.member?.roles.remove(lvl70);
          }
          if (levelMath === 80) {
            message?.member?.roles.add(lvl80);
            message?.member?.roles.remove(lvl75);
          }
          if (levelMath === 85) {
            message?.member?.roles.add(lvl85);
            message?.member?.roles.remove(lvl80);
          }
          // Send the user a notification
          LVLCHANNEL.send({
            content: `${message?.author}, you just advanced to **Rank ${levelMath}**`,
          });
        } catch (err) {
          console.error(
            "There was a problem updating roles in the rank_xp module: ",
            err
          );
        }
      }
    }
    // add user to xpLimit for 60 seconds to prevent spamming for xp
    xpLimit.add(message?.author?.id);
    setTimeout(() => {
      xpLimit.delete(message?.author?.id);
    }, 60000);
  }
  // Count all new messages towards msgCount
  if (!userRankData)
    userRankData = await dbFind(rankSchema, { id: message?.author?.id });
  for (const data of userRankData) {
    let { msgCount } = data;
    let msgMath = parseInt(msgCount) + 1;
    await dbUpdateOne(
      rankSchema,
      { id: message?.author?.id },
      { msgCount: msgMath }
    );
  }
};

//  try {
//   const lvl5 = guild.roles.cache.get(process.env.LVL5);
//   const lvl10 = guild.roles.cache.get(process.env.LVL10);
//   const lvl15 = guild.roles.cache.get(process.env.LVL15);
//   const lvl20 = guild.roles.cache.get(process.env.LVL20);
//   const lvl25 = guild.roles.cache.get(process.env.LVL25);
//   const lvl30 = guild.roles.cache.get(process.env.LVL30);
//   const lvl35 = guild.roles.cache.get(process.env.LVL35);
//   const lvl40 = guild.roles.cache.get(process.env.LVL40);
//   const lvl45 = guild.roles.cache.get(process.env.LVL45);
//   const lvl50 = guild.roles.cache.get(process.env.LVL50);
//   const lvl55 = guild.roles.cache.get(process.env.LVL55);
//   const lvl60 = guild.roles.cache.get(process.env.LVL60);
//   const lvl65 = guild.roles.cache.get(process.env.LVL65);
//   const lvl70 = guild.roles.cache.get(process.env.LVL70);
//   const lvl75 = guild.roles.cache.get(process.env.LV75);
//   const lvl80 = guild.roles.cache.get(process.env.LVL80);
//   const lvl85 = guild.roles.cache.get(process.env.LVL85);
//   if (levelMath === 5) {
//     message.member?.roles.add(lvl5);
//   }
//   if (levelMath === 10) {
//     message?.member?.roles.add(lvl10);
//     message?.member?.roles.remove(lvl5);
//   }
//   if (levelMath === 15) {
//     message?.member?.roles.add(lvl15);
//     message?.member?.roles.remove(lvl10);
//   }
//   if (levelMath === 20) {
//     message?.member?.roles.add(lvl20);
//     message?.member?.roles.remove(lvl15);
//   }
//   if (levelMath === 25) {
//     message?.member?.roles.add(lvl25);
//     message?.member?.roles.remove(lvl20);
//   }
//   if (levelMath === 30) {
//     message?.member?.roles.add(lvl30);
//     message?.member?.roles.remove(lvl25);
//   }
//   if (levelMath === 35) {
//     message?.member?.roles.add(lvl35);
//     message?.member?.roles.remove(lvl30);
//   }
//   if (levelMath === 40) {
//     message?.member?.roles.add(lvl40);
//     message?.member?.roles.remove(lvl35);
//   }
//   if (levelMath === 45) {
//     message?.member?.roles.add(lvl45);
//     message?.member?.roles.remove(lvl40);
//   }
//   if (levelMath === 50) {
//     message?.member?.roles.add(lvl50);
//     message?.member?.roles.remove(lvl45);
//   }
//   if (levelMath === 55) {
//     message?.member?.roles.add(lvl55);
//     message?.member?.roles.remove(lvl50);
//   }
//   if (levelMath === 60) {
//     message?.member?.roles.add(lvl60);
//     message?.member?.roles.remove(lvl55);
//   }
//   if (levelMath === 65) {
//     message?.member?.roles.add(lvl65);
//     message?.member?.roles.remove(lvl60);
//   }
//   if (levelMath === 70) {
//     message?.member?.roles.add(lvl70);
//     message?.member?.roles.remove(lvl65);
//   }
//   if (levelMath === 75) {
//     message?.member?.roles.add(lvl75);
//     message?.member?.roles.remove(lvl70);
//   }
//   if (levelMath === 80) {
//     message?.member?.roles.add(lvl80);
//     message?.member?.roles.remove(lvl75);
//   }
//   if (levelMath === 85) {
//     message?.member?.roles.add(lvl85);
//     message?.member?.roles.remove(lvl80);
//   }
