require('dotenv').config()

const ExtendedClient = require('./class/ExtendedClient');

const bot = new ExtendedClient();

bot.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
// const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder, Collection } = require('discord.js')
// const fs = require('fs');
// const { connect } = require('mongoose')


// const bot = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages
//     ]})

// bot.commands = new Collection;
// bot.commandArray = [];
// bot.modals = new Collection;
    
// const functionFolders = fs.readdirSync(`./src/functions`);
// for (const folder of functionFolders) {
//   const functionFiles = fs
//     .readdirSync(`./src/functions/${folder}`)
//     .filter((file) => file.endsWith(".js"));
//   for (const file of functionFiles)
//     require(`./functions/${folder}/${file}`)(bot);
// }




// bot.login(process.env.TOKEN);
// (async () => {
//   await connect(process.env.MONGO_DB).catch(console.error);
// })();
