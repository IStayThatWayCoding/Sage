const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const mongo = require('../../../handlers/mongoose')
const ExtendedClient = require("../../../class/ExtendedClient");
const path = require('path');
const rankSchema = require('../../../schemas/rank-schem')

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check the highest user on the leaderboard!"),
  /**
   * @param {ExtendedClient} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {

    await interaction.deferReply()

    const response = new EmbedBuilder()
      .setColor("#32BEA6")
      .setTimestamp();

    await mongo()
      .then(async (mongoose) => {
        const sort = await rankSchema
          .find({
            rank: {
              $gte: 1,
              $lt: 50,
            },
          })
          .catch((err) =>
            console.error(
              `${path.basename(
                __filename
              )} There was a problem finding a database entry: `,
              err
            )
          );

        sortArr = [];
        for (const data of sort) {
          const { id, xp } = data;

          sortArr.push({
            id,
            xp,
          });
        }
      })
      .catch((err) =>
        console.error(
          `${path.basename(
            __filename
          )} There was a problem connecting to the database: `,
          err
        )
      );

    sortArr.sort(function (a, b) {
      return b.xp - a.xp;
    });

    function kFormatter(num) {
      return Math.abs(num) > 999
        ? Math.sign(num) * ((Math.abs(num) / 1000) * 1).toFixed(0) + "K"
        : Math.sign(num) * Math.abs(num);
    }

    rankArr = [];
    for (let i = 0; i < sortArr.length; i++) {
      let exists = interaction.guild.members.cache.get(sortArr[i].id);

      if (exists) {
        xpkFormat = kFormatter(sortArr[i].xp);
        rankArr.push({ id: sortArr[i].id, xp: xpkFormat });
      }
    }

    // response.setDescription(`:trophy: \`Oasis's Resort Leaderboard\`\n\n🥇 <@${rankArr[0].id}> - **${rankArr[0].xp}** XP\n🥈 <@${rankArr[1].id}> - **${rankArr[1].xp}** XP\n🥉 <@${rankArr[2].id}> - **${rankArr[2].xp}** XP\n\`4.\` <@${rankArr[3].id}> - **${rankArr[3].xp}** XP\n\`5.\` <@${rankArr[4].id}> - **${rankArr[4].xp}** XP`, false)

    response.setDescription(
      `:trophy: \`Oasis's Resort Leaderboard\`\n\n🥇 <@${rankArr[0].id}> - **${rankArr[0].xp}** XP\n🥈 <@${rankArr[1].id}> - **${rankArr[1].xp}** XP\n🥉 <@${rankArr[2].id}> - **${rankArr[2].xp}** XP\n\`4.\` <@${rankArr[3].id}> - **${rankArr[3].xp}** XP\n\`5.\` <@${rankArr[4].id}> - **${rankArr[4].xp}** XP\n\`6.\` <@${rankArr[5].id}> - **${rankArr[5].xp}** XP\n\`7.\` <@${rankArr[6].id}> - **${rankArr[6].xp}** XP\n\`8.\` <@${rankArr[7].id}> - **${rankArr[7].xp}** XP\n\`9.\` <@${rankArr[8].id}> - **${rankArr[8].xp}** XP\n\`10.\` <@${rankArr[9].id}> - **${rankArr[9].xp}** XP`,
      false
    );

    // response.setDescription(`This command is currently unavailable. Please try again later.`)
    interaction.editReply({
        embeds: [response]
    })
  },
};
