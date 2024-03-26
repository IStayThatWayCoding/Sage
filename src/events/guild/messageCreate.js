const { ChannelType, Message, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const ExtendedClient = require("../../class/ExtendedClient");
const autoReply = require('../../modules/autoReply');
const autoWarn = require("../../modules/autoWarn");
const rankXP = require('../../modules/rank_xp')
const colors = require('../../colors.json');
const stickyMessage = require("../../modules/stickyMessage");
const cooldown = new Map();

module.exports = {
    event: "messageCreate",
    /**
     *
     * @param {ExtendedClient} bot
     * @param {Message} message
     * @returns
     */
    run: async (bot, message) => {
        if (message.author.bot) return;

        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER);
        if(message.guild === staffServer) return;

        // const DMC = staffServer.channels.cache.get(process.env.DMLOGS)

        if (message?.channel.type === 1) {
          const images = [];

          var Attachment = message.attachments.first();

          if (message.attachments.size !== 0) {
            images.push(`${Attachment.url}\n\n`)
          }

          if (message.attachments.size == 0) {
            images.push("No Attachments Found");
          }
          console.log(images);

          const dmEmbed = new EmbedBuilder()
            .setTitle("New DM")
            .setColor(colors.TRANSPARENT)
            .setTimestamp()
            .setDescription(
              `**User:** ${message.author.tag}\n**USER ID**: ${
                message.author.id
              }\n**At**: ${new Date()}\n\n**Content** \`\`\`${
                message.content
              }\`\`\`\n\n**ATTACHMENTS:**\n ${images}`
            );

          const DMC = bot.channels.cache.get("1222109924448796683");
          DMC.send({
            embeds: [dmEmbed]
          });
        }

        if (!config.handler.commands.prefix) return;

        let prefix = process.env.PREFIX

        autoReply(bot, message);
        autoWarn(bot, message);
        rankXP(bot, message);
        stickyMessage(bot, message);

        // if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandInput = args.shift().toLowerCase();

        if (!commandInput.length) return;

        let command =
            bot.collection.prefixcommands.get(commandInput) ||
            bot.collection.prefixcommands.get(
                bot.collection.aliases.get(commandInput)
            );

        if (command) {
            try {
                if (
                    command.structure?.permissions &&
                    !message.member.permissions.has(command.structure?.permissions)
                ) {
                    await message.reply({
                        content:
                            config.messageSettings.notHasPermissionMessage !== undefined &&
                                config.messageSettings.notHasPermissionMessage !== null &&
                                config.messageSettings.notHasPermissionMessage !== ""
                                ? config.messageSettings.notHasPermissionMessage
                                : "You do not have the permission to use this command.",
                    });

                    return;
                }

                if (command.structure?.developers) {
                    if (!config.users.developers.includes(message.author.id)) {
                        setTimeout(async () => {
                            await message.reply({
                                content:
                                    config.messageSettings.developerMessage !== undefined &&
                                        config.messageSettings.developerMessage !== null &&
                                        config.messageSettings.developerMessage !== ""
                                        ? config.messageSettings.developerMessage
                                        : "You are not authorized to use this command",
                            });
                        }, 5 * 1000);
                    }

                    return;
                }

                if (command.structure?.nsfw && !message.channel.nsfw) {
                    await message.reply({
                        content:
                            config.messageSettings.nsfwMessage !== undefined &&
                                config.messageSettings.nsfwMessage !== null &&
                                config.messageSettings.nsfwMessage !== ""
                                ? config.messageSettings.nsfwMessage
                                : "The current channel is not a NSFW channel.",
                    });

                    return;
                }

                if (command.structure?.cooldown) {
                    const cooldownFunction = () => {
                        let data = cooldown.get(message.author.id);

                        data.push(commandInput);

                        cooldown.set(message.author.id, data);

                        setTimeout(() => {
                            let data = cooldown.get(message.author.id);

                            data = data.filter((v) => v !== commandInput);

                            if (data.length <= 0) {
                                cooldown.delete(message.author.id);
                            } else {
                                cooldown.set(message.author.id, data);
                            }
                        }, command.structure?.cooldown);
                    };

                    if (cooldown.has(message.author.id)) {
                        let data = cooldown.get(message.author.id);

                        if (data.some((v) => v === commandInput)) {
                            await message.reply({
                                content:
                                    (config.messageSettings.cooldownMessage !== undefined &&
                                        config.messageSettings.cooldownMessage !== null &&
                                        config.messageSettings.cooldownMessage !== ""
                                        ? config.messageSettings.cooldownMessage
                                        : "Slow down buddy! You're too fast to use this command ({cooldown}s).").replace(/{cooldown}/g, command.structure.cooldown / 1000),
                            });

                            return;
                        } else {
                            cooldownFunction();
                        }
                    } else {
                        cooldown.set(message.author.id, [commandInput]);

                        cooldownFunction();
                    }
                }

                command.run(bot, message, args);
            } catch (error) {
                log(error, "err");
            }
        }
    },
};