const { InteractionType } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const config = require("../../config");
const distubeFile = require('../../utils/distube')
const { DisTube } = require('distube')

const cooldown = new Map();


module.exports = {
  event: "interactionCreate",
  /**
   *
   * @param {ExtendedClient} bot
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (bot, interaction) => {
    const { SpotifyPlugin } = require('@distube/spotify')
    const { SoundCloudPlugin } = require('@distube/soundcloud')
    const { YtDlpPlugin } = require('@distube/yt-dlp');

    bot.distube = new DisTube(bot, {
        leaveOnStop: false,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        plugins: [
            new SpotifyPlugin({
                emitEventsAfterFetching: true
            }),
            new SoundCloudPlugin(),
            new YtDlpPlugin()
        ]
    })

    distubeFile(bot, interaction)

    if (!interaction.isCommand()) return;

    if (
        config.handler.commands.slash === false &&
        interaction.isChatInputCommand()
    )
        return;
    if (
        config.handler.commands.user === false &&
        interaction.isUserContextMenuCommand()
    )
        return;
    if (
        config.handler.commands.message === false &&
        interaction.isMessageContextMenuCommand()
    )
        return;

    // Check if the interaction is being used in the staff server. If so, ignore it.
    if(interaction.guild == process.env.STAFF_SERVER) return interaction.reply({ content: `Application commands cannot be used in the staff server! `, ephemeral: true})

        if (interaction.isButton()) {
            const component = bot.collection.components.buttons.get(
              interaction.customId
            );

      
            if (!component) return;
      
            if (!(await componentPermission(component))) return;
      
            try {
              component.run(bot, interaction);
            } catch (error) {
              console.log(error);
            }
      
            return;
          }

          

    const command = bot.collection.interactioncommands.get(
        interaction.commandName
    );

    if (!command) return;

    try {
        if (command.options?.developers) {
            if (
                config.users?.developers?.length > 0 &&
                !config.users?.developers?.includes(interaction.user.id)
            ) {
                await interaction.reply({
                    content:
                        config.messageSettings.developerMessage !== undefined &&
                            config.messageSettings.developerMessage !== null &&
                            config.messageSettings.developerMessage !== ""
                            ? config.messageSettings.developerMessage
                            : "You are not authorized to use this command",
                    ephemeral: true,
                });

                return;
            } else if (config.users?.developers?.length <= 0) {
                await interaction.reply({
                    content:
                        config.messageSettings.missingDevIDsMessage !== undefined &&
                            config.messageSettings.missingDevIDsMessage !== null &&
                            config.messageSettings.missingDevIDsMessage !== ""
                            ? config.messageSettings.missingDevIDsMessage
                            : "This is a developer only command, but unable to execute due to missing user IDs in configuration file.",

                    ephemeral: true,
                });

                return;
            }
        }

        if (command.options?.nsfw && !interaction.channel.nsfw) {
            await interaction.reply({
                content:
                    config.messageSettings.nsfwMessage !== undefined &&
                        config.messageSettings.nsfwMessage !== null &&
                        config.messageSettings.nsfwMessage !== ""
                        ? config.messageSettings.nsfwMessage
                        : "The current channel is not a NSFW channel",

                ephemeral: true,
            });

            return;
        }

        if (command.options?.cooldown) {
            const isGlobalCooldown = command.options.globalCooldown;
            const cooldownKey = isGlobalCooldown ? 'global_' + command.structure.name : interaction.user.id;
            const cooldownFunction = () => {
                let data = cooldown.get(cooldownKey);

                data.push(interaction.commandName);

                cooldown.set(cooldownKey, data);

                setTimeout(() => {
                    let data = cooldown.get(cooldownKey);

                    data = data.filter((v) => v !== interaction.commandName);

                    if (data.length <= 0) {
                        cooldown.delete(cooldownKey);
                    } else {
                        cooldown.set(cooldownKey, data);
                    }
                }, command.options.cooldown);
            };

            if (cooldown.has(cooldownKey)) {
                let data = cooldown.get(cooldownKey);

                if (data.some((v) => v === interaction.commandName)) {
                    const cooldownMessage = (isGlobalCooldown
                        ? config.messageSettings.globalCooldownMessage ?? "Slow down buddy! This command is on a global cooldown ({cooldown}s)."
                        : config.messageSettings.cooldownMessage ?? "Slow down buddy! You're too fast to use this command ({cooldown}s).").replace(/{cooldown}/g, command.options.cooldown / 1000);

                    await interaction.reply({
                        content: cooldownMessage,
                        ephemeral: true,
                    });

                    return;
                } else {
                    cooldownFunction();
                }
            } else {
                cooldown.set(cooldownKey, [interaction.commandName]);
                cooldownFunction();
            }
        }

        command.run(bot, interaction);
    } catch (error) {
        log(error, "err");
    }
},
};

// module.exports = {
//   name: "interactionCreate",
//   async execute(interaction, bot) {
//     if (interaction.isChatInputCommand()) {
//       const { commands } = bot;
//       const { commandName } = interaction;
//       const command = commands.get(commandName);
//       if (!command) return;

//       try {
//         await command.execute(interaction, bot);
//       } catch (error) {
//         console.error(error);
//         await interaction.reply({
//           content: `Something went wrong while executing this command. Please try again later.`,
//           ephemeral: true,
//         });
//       }
//     } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
//       const { commands } = bot;
//       const { commandName } = interaction;
//       const command = commands.get(commandName);
//       if (!command) return;

//       try {
//         await command.autocomplete(interaction, bot);
//       } catch (err) {
//         console.error(err)

//       }
//     } else if (interaction.type == InteractionType.ModalSubmit) {
//       const { modals } = bot;
//       const { customId } = interaction;
//       const modal = modals.get(customId);
//       if (!modal) return new Error("No code for modal");

//       try {
//         await modal.execute(interaction, bot);
//       } catch (error) {
//         console.error(error)

//       }
//   }
// },

// }
