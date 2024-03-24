const { Message, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} bot
 * @param {Message} message 
 */

module.exports = async (bot, message) => {
    const guild = bot.guilds.cache.get(process.env.GUILD_ID);
    const introChannel = guild.channels.cache.get(process.env.INTRODUCTIONCHANNEL);
    const avatarURL = bot.user.avatarURL({ format: "gif", size: 256 });

    const fanArtChannel = guild.channels.cache.get(process.env.FANART)

    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('intro-info')
                .setLabel("How to Introduce Yourself :D")
                .setStyle(ButtonStyle.Primary)
        );

        const button2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('fanart-info')
                .setLabel("Sending Fan Art :D")
                .setStyle(ButtonStyle.Primary)
        );

        if (message?.channel.id === process.env.INTRODUCTIONCHANNEL && !message?.author.bot) {
            try {
              const messages = await introChannel.messages.fetch({ limit: 5 });
              const messageFound = messages.find((m) =>
                m.content.includes("introducing yourself")
              );

              if (messageFound) await messageFound.delete().catch(err => console.error(`There was a problem deleting a message: `, err));
              await introChannel
                .createWebhook({
                  name: bot.user.username,
                  avatar: `${avatarURL}`,
                })
                .then((webhook) => {
                  webhook
                    .send({
                      content: `👋 Click the button below to get information about introducing yourself!`,
                      components: [button],
                    })
                    .catch((err) =>
                      console.error(
                        `There was a problem sending a webhook message: `,
                        err
                      )
                    )
                    .then(() => {
                      webhook
                        .delete()
                        .catch((err) =>
                          console.error(
                            `There was a problem deleting a webhook: `,
                            err
                          )
                        );
                    });
                })
                .catch((err) =>
                  console.error(`There was a problem sending a webhook: `, err)
                );
            } catch (err) {
              console.error(
                `There was a problem fetching messages in the intro channel: `,
                err
              );
            }
        }

        if (message?.channel.id === process.env.FANART && !message?.author.bot) {
            try {
              const messages = await fanArtChannel.messages.fetch({ limit: 5 });
              const messageFound = messages.find((m) =>
                m.content.includes("Fan Art")
              );

              if (messageFound) await messageFound.delete().catch(err => console.error(`There was a problem deleting a message: `, err));
              await fanArtChannel
                .createWebhook({
                  name: bot.user.username,
                  avatar: `${avatarURL}`,
                })
                .then((webhook) => {
                  webhook
                    .send({
                      content: `🎈  Click the button below to get information about sending Fan Art!`,
                      components: [button2],
                    })
                    .catch((err) =>
                      console.error(
                        `There was a problem sending a webhook message: `,
                        err
                      )
                    )
                    .then(() => {
                      webhook
                        .delete()
                        .catch((err) =>
                          console.error(
                            `There was a problem deleting a webhook: `,
                            err
                          )
                        );
                    });
                })
                .catch((err) =>
                  console.error(`There was a problem sending a webhook: `, err)
                );
            } catch (err) {
              console.error(
                `There was a problem fetching messages in the fan art channel: `,
                err
              );
            }
        }

}