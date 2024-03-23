const { btoa } = require("buffer");
const fs = require("fs");
const { connection } = require("mongoose");
const ExtendedClient = require('../class/ExtendedClient');
const { Message } = require('discord.js')

/**
 * 
 * @param {ExtendedClient} bot 
 * @param {Message} message
 */

module.exports = (bot) => {
  for (const dir of fs.readdirSync("./src/events/")) {
    for (const file of fs
      .readdirSync("./src/events/" + dir)
      .filter((f) => f.endsWith(".js"))) {
      const module = require("../events/" + dir + "/" + file);

      if (!module) continue;

      if (!module.event || !module.run) {
        console.log(
          "Unable to load the event " +
            file +
            " due to missing 'name' or/and 'run' properties."
        );

        continue;
      }

      console.log("Loaded new event: " + file);

      if (module.once) {
        bot.once(module.event, (...args) => module.run(bot, ...args));
      } else {
        bot.on(module.event, (...args) => module.run(bot, ...args));
      };
    };
  };
};
// module.exports = (bot) => {
//   bot.handleEvents = async () => {
//     const eventFolders = fs.readdirSync(`./src/events`);
//     for (const folder of eventFolders) {
//       const eventFiles = fs
//         .readdirSync(`./src/events/${folder}`)
//         .filter((file) => file.endsWith(".js"));
//       switch (folder) {
//         case "bot":
//           for (const file of eventFiles) {
//             const event = require(`../../events/${folder}/${file}`);
//             if (event.once)
//               bot.once(event.name, (...args) => event.execute(...args, bot));
//             else bot.on(event.name, (...args) => event.execute(...args, bot));
//           }
//           break;

//         case "mongodb":
//           for (const file of eventFiles) {
//             const event = require(`../../events/${folder}/${file}`);
//             if (event.once)
//               connection.once(event.name, (...args) =>
//                 event.execute(...args, bot)
//               );
//             else
//               connection.on(event.name, (...args) =>
//                 event.execute(...args, bot)
//               );
//           }
//           break;

//         default:
//           break;
//       }
//     }
//   };
// };
