const { SlashCommandBuilder, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, codeBlock, PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const toSchema = require('../../../schemas/toSchema');
const rules = require('../../../utils/rules')
const { uuid } = require('uuidv4');
const { sendResponse, dbCreate, dbDeleteOne } = require("../../../utils/utils");
const ms = require('ms')
  
module.exports = {
  structure: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Add/lists timeouts to/from a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a timeout to a user")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The target")
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName('duration')
            .setDescription("Duration for timeout (30m, 1h, 1 day)")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the timeout")
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
              "Provide a reason for timing out the user (when selecting custom)"
            )
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("remove")
      .setDescription("Remove a timeout from a user")
      .addStringOption((option) =>
        option
          .setName("timeout")
          .setDescription("The timeout ID to be removed")
          .setRequired(true)
      )
  )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List timeouts for a user")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The user you want to see timeouts for")
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
    const logChannel = staffServer.channels.cache.get(process.env.TIMEOUTS_CHANNEL);

    await interaction.deferReply()

    switch (options.getSubcommand()) {
      case "add": {
        const guildID = guild.id;
        const user = options.getMember("username");
        const custom = options.getString("custom");
        const userID = user?.id;
        const username = user?.user.username;
        const authorTag = member?.user.username;
        const toID = uuid();
        const author = member.id;
        const timestamp = new Date().getTime();
        let reason = options.getString("reason");
        const duration = options.getString("duration");

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
          await interaction.editReply('Please provide a valid timeout duration.');
          return;
        }
    
        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply('Timeout duration cannot be less than 5 seconds or more than 28 days.');
            return;
          }

        if (!array.includes(reason)) reason = custom;

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
        if (!userID || !username)
          return sendResponse(
            interaction,
            `There was an error when finding the user`
          );

        // Logging
        let log = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${authorTag}`,
            iconURL: member?.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `**User:** ${username} *(${toID})* \n**Reason** ${reason}`
          )
          .setFooter({ text: `Timeout added - ${toID}` });

        logChannel
          .send({
            embeds: [log],
          })
          .catch((err) => console.error(err));

        // DB
        await dbCreate(toSchema, {
            guildID,
            userID,
            username,
            toID,
            author,
            authorTag,
            timestamp,
            reason,
          });

          // Fetch
          const results = await toSchema.find({ guildID, userID });

          try {

            if (user.isCommunicationDisabled()) {
                await user.timeout(msDuration, reason);
                await sendResponse(interaction, `${user}'s timeout has been updated to ${msDuration}\nReason: ${reason}`)
                return;
            }

            await user.timeout(msDuration, reason);;
          } catch (error) {
            console.log(error)
          }


          await user.send({
            content: `${user} - You have been timed out in ${guild.name}\n${codeBlock(reason)}`
          }).then(() => sendResponse(interaction, `Timeout has been added!`)).catch(() => sendResponse(interaction, `Timeout has been added, but I couldn't DM the user.`))
        
      }
      break;
      
      case "list": {
        const user = options.getMember("username");

        const results = await toSchema.find({ userID: user.id });

        // No results!!!!
        if (results.length === 0)
          return sendResponse(interaction, `User has no timeouts!`);

        // Embed :D
        let tEmbed = new EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({
            name: `Timeouts for ${user?.user.username}`,
            iconURL: user?.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        let timeoutCount = `0`;
        for (const timeout of results ) {
            const { toID, author, timestamp, reason } = timeout;

            const executor = guild.members.cache.get(author);

            // Add Data
          tEmbed.addFields({
            name: `#${timeoutCount}`,
            value: `**Member:** ${user?.user.username} *(${user?.id})*
**Timed Out By:** ${executor.user.username} *(${executor.id})*
**Date:** <t:${Math.round(timestamp / 1000)}> (<t:${Math.round(
              timestamp / 1000
            )}:R>)
**Timeout ID:** ${toID}
**Reason:** ${reason}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            inline: false,
          });
          timeoutCount++
        }
        sendResponse(interaction, ``, [tEmbed]);
        break;
      }
      case "remove": {
        const timeout = options.getString("timeout");
        // Fetch warnings
        const results = (await toSchema.find({ toID: timeout }))[0];
        // None were found, then:
        if (!results)
          return sendResponse(
            interaction,
            `Timeout *'${timeout}'* does not exist or has already been removed`
          );
        // Find + Remove
        await dbDeleteOne(toSchema, { toID: timeout });
        // Log
        let log = new EmbedBuilder()
          .setColor("DarkGreen")
          .setAuthor({
            name: `${member.user.username}`,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`**User:** ${results.username} *(${results.userID})*`)
          .setFooter({ text: `Timeout Removed - ${results.toID}` })
          .setTimestamp();

        logChannel
          .send({
            embeds: [log],
          })
          .catch((err) => console.error(err));
        // Follow up
        sendResponse(interaction, `Timeout '${timeout}' removed!`);
        break;
      }
    }

  }}