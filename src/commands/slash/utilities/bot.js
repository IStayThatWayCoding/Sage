const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    time,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
const { sendResponse } = require("../../../utils/utils");
const mongoose = require('mongoose')
const fs = require('fs')
  
  module.exports = {
    structure: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Returns information about the bot")
        .addSubcommand((subcommand) =>
            subcommand
          .setName("info")
          .setDescription("Get information about the bot.")
      )
        .addSubcommand((subcommand) =>
            subcommand.setName("stats").setDescription("Get the bot status")
      )
        .toJSON(),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const subcommand = interaction.options.getSubcommand()
        if (subcommand === "info") {
            const { guild } = interaction;
            await interaction.deferReply()
            try {
                discordJsVersion = require('discord.js').version;

                const nodeJsVersion = process.version;

        const mongoDbVersion = mongoose.version;
        const activeCommands = await bot.application.commands.fetch();

        const activeCommandCount = activeCommands.size;
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Bot Info",
            iconURL: `${bot.user.displayAvatarURL({ dynamic: true })}`,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          })
          .addFields(
            {
              name: `\`🤖\`** | DJS Version:**`,
              value: `> [*${discordJsVersion}*](https://discord.js.org/docs/packages/discord.js/14.14.1)`,
              inline: true,
            },
            {
              name: `\`🚀\`** | NodeJs Version:**`,
              value: `> [*${nodeJsVersion}*](https://nodejs.org/dist/latest-v20.x/docs/api/)`,
              inline: true,
            },
            {
              name: `\`🗄️\`** | Database Version:**`,
              value: `> [*${mongoDbVersion}*](https://docs.mongodb.com/drivers/node/)`,
              inline: true,
            },
            {
              name: `\`🧑‍💻\`** | Developer:**`,
              value: `> \`istay\`\n>[Website](https://istaythatway.com)`, // The developer. Change it to whatever you wish
              inline: true,
            },
            {
              name: `\`🗓️\`** | Created:**`,
              value: `> \`14/02/2024\``,
              inline: true,
            },
            {
              name: `\`⚙️\`** | Active Commands:**`,
              value: `> \`${activeCommandCount}\``,
              inline: true,
            }
          )
          .setColor("Fuchsia")
          .setTimestamp()
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.displayAvatarURL({
              dynamic: true,
            })}`,
          })
          .setThumbnail(
            "https://media.discordapp.net/attachments/1211983642394628136/1221397023715233872/infoIcon.gif"
          );

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(`An error occured in the bot-info command:\n\n${error}`);
        interaction.editReply({
          content:
            "An error occured while processing your command. Try again later.",
        });
      }
    }
    if (subcommand === "stats") {
      try {
        const startTime = Date.now();

        const placeEmbed = new EmbedBuilder()
          .setTitle("Fetching...")
          .setColor("Fuchsia");

        await interaction.reply({ embeds: [placeEmbed] });

        const latency = await bot.ws.ping; // Websocket latency
        const restLatency = Date.now() - startTime; // REST latency
        const uptime = new Date(Date.now() - bot.uptime); // Calculate uptime of the bot

        // Function to format bytes into a human-readable format with decimal points
        function formatBytes(bytes) {
          const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
          if (bytes === 0) return "0 Byte";
          const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
          const result = (bytes / Math.pow(1024, i)).toFixed(2);

          if (isNaN(result)) {
            console.log("Error: Result is NaN. Bytes:", bytes);
            return "Error";
          }

          return result + " " + sizes[i];
        }

        // Function to get the size of a directory recursively
        async function getDirectorySize(path) {
          // Recursive function to calculate the total size of a directory
          const calculateSize = async (currentPath) => {
            let totalSize = 0; // Initialize totalSize for each directory
            const files = fs.readdirSync(currentPath);

            for (const file of files) {
              const filePath = `${currentPath}/${file}`;
              const stats = fs.statSync(filePath);

              if (stats.isDirectory()) {
                totalSize += await calculateSize(filePath);
              } else {
                totalSize += stats.size;
              }
            }

            return totalSize;
          };

          return await calculateSize(path);
        }

        const projectDirectoryPath = "./src/"; // Specify the path to your project directory
        const projectSize = await getDirectorySize(projectDirectoryPath);

        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Bot Status",
            iconURL: `${bot.user.displayAvatarURL({ dynamic: true })}`,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          })
          .addFields(
            {
              name: `\`🔌\`** | Websocket:**`,
              value: `> *\`${latency} m/s\`*`,
              inline: true,
            },
            {
              name: `\`🌍\`** | REST:**`,
              value: `> *\`${restLatency} m/s\`*`,
              inline: true,
            },
            {
              name: `\`📈\`** | Uptime:**`,
              value: `> ${time(uptime, "R")}`,
              inline: true,
            },
            {
              name: `\`💻\`** | CPU:**`,
              value: `> *\`${(process.cpuUsage().system / 1024 / 1024).toFixed(
                2
              )}%\`*`,
              inline: true,
            },
            {
              name: `\`💽\`** | RAM:**`,
              value: `> *\`${(
                process.memoryUsage().heapUsed /
                1024 /
                1024
              ).toFixed(2)}MB\`*`,
              inline: true,
            },
            {
              name: `\`🗃️\`** | Storage:**`,
              value: `> *\`${formatBytes(projectSize)}\`*`,
              inline: true,
            }
          )
          .setColor("Fuchsia")
          .setTimestamp()
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
          }) // Set's the embed footer
          .setThumbnail(
            "https://media.discordapp.net/attachments/1211983642394628136/1221395272211497001/serverIcon.gif"
          );

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(`An error occured in the bot-status command:\n\n${error}`);
        interaction.editReply({
          content:
            "An error occured while processing your command. Try again later.",
        });
      }
    }
            }
        }