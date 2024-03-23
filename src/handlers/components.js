const { readdirSync, readdir } = require("fs");
const ExtendedClient = require("../class/ExtendedClient");

/**
 *
 * @param {ExtendedClient} bot
 */

module.exports = (bot) => {
    for (const dir of readdirSync('./src/components/')) {
        for (const file of readdirSync('./src/components/' + dir).filter((f) => f.endsWith('.js'))) {
            const module = require('../components/' + dir + '/' + file);

            if (!module) continue;

            if (dir === 'buttons') {
                if (!module.customId || !module.run) {
                    console.log('Unable to load the component ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.');

                    continue;
                };

                bot.collection.components.buttons.set(module.customId, module);
            } else if (dir === 'selects') {
                if (!module.customId || !module.run) {
                    console.log('Unable to load the select menu ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.');

                    continue;
                };

                bot.collection.components.selects.set(module.customId, module);
            } else if (dir === 'modals') {
                if (!module.customId || !module.run) {
                    console.log('Unable to load the modal ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.');

                    continue;
                };

                bot.collection.components.modals.set(module.customId, module);
            } else if (dir === 'autocomplete') {
                if (!module.commandName || !module.run) {
                    console.log(`Unable to load the autocomplete component ${file} due to missing 'commandName' or 'run' properties.`);
                    continue;
                }
                
                bot.collection.components.autocomplete.set(module.commandName, module);
                
                console.log(`Loaded new autocomplete component: ${file}`);
            } else {
                log(`Invalid component type: ${file}`, 'warn');
            }
        }
    }
};

// module.exports = (bot) => {
//     bot.handleComponents = async () => {
//         const componentFolders = readdirSync(`./src/components`);
//         for (const folder of componentFolders ) {
//             const componentFiles = readdirSync(`./src/components/${folder}`).filter(
//                 (file) => file.endsWith(".js")
//             );
//             const { modals } = bot;

//             switch (folder) {
//                 case "modals":
//                     for ( const file of componentFiles ) {
//                         const modal = require(`../../components/${folder}/${file}`);
//                         modals.set(modal.data.name, modal);
//                     }
//                     break;

//                 default:
//                     break;
//             }
//         }
//     }
// }
