const { SlashCommandBuilder, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, codeBlock } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const warnSchema = require('../../../schemas/warnSchema');
const rules = require('../../../utils/rules')
const { uuid } = require('uuidv4');
const { sendResponse, dbCreate, dbDeleteOne } = require("../../../utils/utils");
  
module.exports = {
  structure: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Add/remove/list warning(s) from a user.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a warning to a user")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The target")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the warning")
            .setRequired(true)
            .addChoices(
              {
                name: "Rule 1 - not respectful, harassment, bullying, racism, sexism, etc.",
                value: "Violation of Rule 1",
              },
              {
                name: "Rule 2 - not obeying staff members, arguing",
                value: "Violation of Rule 2",
              },
              {
                name: "Rule 3 - execessive swearing, towards another user",
                value: "Violation of Rule 3",
              },
              { name: "Rule 4 - NSFW content (profiles, etc.)", value: "Violation of Rule 4" },
              { name: "Rule 5 - Unsafe links, dox, etc.", value: "Violation of Rule 5" },
              { name: "Rule 6 - Spam/Mass Ping", value: "Violation of Rule 6" },
              {
                name: "Rule 7 - Not using channels for their correct usage",
                value: "Violation of Rule 7",
              },
              { name: "Rule 8 - Uncomfortable topics discussed", value: "Violation of Rule 8" },
              { name: "Rule 9 - Disruptive in VC", value: "Violation of Rule 9" },
              {
                name: "Rule 10 - Self-promoting, loopholes, underage (joking or not), upsetting others, etc.",
                value: "Violation of Rule 10",
              },
              { name: "Rule 11 - Punishment evasion", value: "Violation of Rule 11" },
              {
                name: "Rule 12 - Discussing other users' punishments",
                value: "Violation of Rule 12",
              },
              {
                name: "Rule 13 - Violation of Discord TOS/Community Guidelines",
                value: "Violation of Rule 13",
              },
              { name: "Custom", value: "custom" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("custom")
            .setDescription(
              "Provide a reason for warning the user (when selecting custom)"
            )
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a warning from a user")
        .addStringOption((option) =>
          option
            .setName("warning")
            .setDescription("The warning ID to be removed")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List warnings for a user")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The user you want to see warnings for")
            .setRequired(true)
        )
    ),
  /**
   * @param {ExtendedClient} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const array = [
        "Violation of Rule 1",
        "Violation of Rule 2",
        "Violation of Rule 3",
        "Violation of Rule 4",
        "Violation of Rule 5",
        "Violation of Rule 6",
        "Violation of Rule 7",
        "Violation of Rule 8",
        "Violation of Rule 9",
        "Violation of Rule 10",
        "Violation of Rule 11",
        "Violation of Rule 12",
        "Violation of Rule 13",
    ]
    const { member, guild, options } = interaction;
    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
    const logChannel = staffServer.channels.cache.get(process.env.WARNINGS_CHANNEL);
    console.log(logChannel)

    await interaction.deferReply();

    switch (options.getSubcommand()) {
      case "add": {
        const guildID = guild.id;
        const user = options.getMember("username");
        const custom = options.getString("custom");
        const userID = user?.id;
        const username = user?.user.username;
        const authorTag = member?.user.username;
        const warnID = uuid();
        const author = member.id;
        const timestamp = new Date().getTime();
        let reason = options.getString("reason");

        // if (isNaN(reason)) reason = custom;
        if (!array.includes(reason)) reason = custom;

        // No reason
        if (reason == null)
          return sendResponse(
            interaction,
            `A custom reason is **required** when selecting the 'Custom' option.`
          );
        // Reason exceeds limit
        if (reason && reason.length > 1024)
          return sendResponse(
            interaction,
            `Reasons are limited to 1024 characters only.`
          );
        // User can't be found
        if (!userID || !username )
          return sendResponse(
            interaction,
            `There was an error when finding the user`
          );

        // Logging
        let log = new EmbedBuilder()
          .setColor("Orange")
          .setAuthor({
            name: `${authorTag}`,
            iconURL: user?.user.displayAvatarURL({ dynamic: false }),
          })
          .setDescription(
            `**User:** ${username} *(${userID})* \n**Reason** ${reason}`
          )
          .setFooter({ text: `Warning added - ${warnID}` });

        logChannel
          .send({
            embeds: [log],
          })
          .catch((err) => console.error(err));

        // DB
        await dbCreate(warnSchema, {
          guildID,
          userID,
          username,
          warnID,
          author,
          authorTag,
          timestamp,
          reason,
        });
        // Fetch
        const results = await warnSchema.find({ guildID, userID });

        if (results.length >= 3) {
          // Ban user if warn limit is exceeded
          await user
            .ban({ days: 0, reason: `Warning Limit Exceeded` })
            .then(() =>
              sendResponse(interaction, `A cautionary notification has been issued. It's advisable to reconsider actions for optimal outcome.`)
            )
            .catch(() =>
              sendResponse(
                interaction,
                `This is ${user}'s third warning, but I couldn't ban them!`
              )
            );
        } else {
          // Notification
          await user
            .send({
              content: `${user} - You have recieved a warning in ${
                guild.name
              } \n${codeBlock(reason)}`,
            })
            .then(() =>
              sendResponse(interaction, `⚠️ A cautionary notification has been issued for ${user}. It's advisable to reconsider actions for optimal outcome. Reason: ${reason}`)
            )
            .catch(() =>
              sendResponse(
                interaction,
                `Your warning has been added, but I couldn't send a DM to ${user}`
              )
            );
        }
        break;
      }

      case "remove": {
        const warning = options.getString("warning");
        // Fetch warnings
        const results = (await warnSchema.find({ warnID: warning }))[0];
        // None were found, then:
        if (!results)
          return sendResponse(
            interaction,
            `Warning *'${warning}'* does not exist or has already been removed`
          );
        // Find + Remove
        await dbDeleteOne(warnSchema, { warnID: warning });
        // Log
        let log = new EmbedBuilder()
          .setColor("DarkGreen")
          .setAuthor({
            name: `${member.user.username}`,
            iconURL: member.user.displayAvatarURL({ dynamic: false }),
          })
          .setDescription(`**User:** ${results.username} *(${results.userID})*`)
          .setFooter({ text: `Warning Removed - ${results.warnID}` })
          .setTimestamp();

        logChannel
          .send({
            embeds: [log],
          })
          .catch((err) => console.error(err));
        // Follow up
        sendResponse(interaction, `Warning '${warning}' removed!`);
        break;
      }

      case "list": {
        const user = options.getMember("username");

        // Fetch
        const results = await warnSchema.find({ userID: user.id });

        // No results!!!!
        if (results.length === 0)
          return sendResponse(interaction, `User has no warnings!`);

        // Embed :D
        let wEmbed = new EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({
            name: `Warnings for ${user?.user.username}`,
            iconURL: user?.user.displayAvatarURL({ dynamic: false }),
          })
          .setTimestamp();

        let warnCount = `0`;
        for (const warning of results) {
          const { warnID, author, timestamp, reason } = warning;

          // Fetch user
          const executor = guild.members.cache.get(author);

          // Add Data
          wEmbed.addFields({
            name: `#${warnCount}`,
            value: `**Member:** ${user?.user.username} *(${user?.id})*
**Warned By:** ${executor.user.username} *(${executor.id})*
**Date:** <t:${Math.round(timestamp / 1000)}> (<t:${Math.round(
              timestamp / 1000
            )}:R>)
**Warning ID:** ${warnID}
**Reason:** ${reason}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            inline: false,
          });
          // Increase count
          warnCount++;
        }
        // Follow up
        sendResponse(interaction, ``, [wEmbed]);
        break;
      }
    }
  },
};