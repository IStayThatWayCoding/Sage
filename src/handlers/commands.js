const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { readdirSync } = require("fs");
require("dotenv").config();

module.exports = (bot) => {
  for (const type of readdirSync("./src/commands/")) {
    for (const dir of readdirSync("./src/commands/" + type)) {
      for (const file of readdirSync(
        "./src/commands/" + type + "/" + dir
      ).filter((f) => f.endsWith(".js"))) {
        const module = require("../commands/" +
          type +
          "/" +
          dir +
          "/" +
          file);

        if (!module) continue;

        if (type === 'prefix') {
          if (!module.structure?.name || !module.run) {
            console.log(
              "Unable to load the command " +
                file +
                " due to missing 'structure#name' or/and 'run' properties."
            );

            continue;
          }

          bot.collection.prefixcommands.set(module.structure.name, module);

          if (
            module.structure.aliases &&
            Array.isArray(module.structure.aliases)
          ) {
            module.structure.aliases.forEach((alias) => {
              bot.collection.aliases.set(alias, module.structure.name);
            });
          }
        } else {
          if (!module.structure.name || !module.run) {
            console.log(
              "Unable to load the command " +
                file +
                " due to missing 'structure#name' or/and 'run' properties."
            );

            continue;
          }

          bot.collection.interactioncommands.set(module.structure.name, module);
          bot.applicationcommandsArray.push(module.structure);
        }

        console.log("Loaded new command: " + file);
      }
    }
  }
};

// module.exports = (bot) => {
//   bot.handleCommands = async () => {
//     const commandFolders = fs.readdirSync("./src/commands");
//     for (const folder of commandFolders) {
//       const commandFiles = fs
//         .readdirSync(`./src/commands/${folder}`)
//         .filter((file) => file.endsWith(".js"));

//       const { commands, commandArray } = bot;
//       for (const file of commandFiles) {
//         const command = require(`../../commands/${folder}/${file}`);
//         commands.set(command.data.name, command);
//         commandArray.push(command.data.toJSON());
//         console.log(`Command: ${command.data.name} has been passed through.`);
//       }
//     }

//     const botID = process.env.BOT_ID;
//     const guildID = process.env.GUILD_ID;
//     const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
//     try {
//       console.log("Started refreshing application (/) commands.");

//       await rest.put(Routes.applicationGuildCommands(botID, guildID), {
//         body: bot.commandArray,
//       });

//       console.log("Successfully reloaded application (/) commands.");
//     } catch (error) {
//       console.error(error);
//     }
//   };
// };
