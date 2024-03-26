require('dotenv').config()

const ExtendedClient = require('./class/ExtendedClient');

const bot = new ExtendedClient();

bot.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
