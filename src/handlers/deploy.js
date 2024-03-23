const { REST, Routes } = require('discord.js');
const config = require('../config');
const ExtendedClient = require("../class/ExtendedClient");

/**
 * 
 * @param {ExtendedClient} bot
 */
module.exports = async (bot) => {
    const rest = new REST({ version: "10" }).setToken(
        process.env.TOKEN || config.bot.token
    );

    try {
        console.log("Started loading application commands...");

        const guildID = process.env.GUILD_ID

        await rest.put(
            Routes.applicationGuildCommands(process.env.BOT_ID || config.bot.id, guildID), {
                body: bot.appplicationcommandArray,
            }
        );
        console.log(`Successfully loaded application commands`);

        await rest.put(
            Routes.applicationCommands(process.env.BOT_ID || config.bot.id), {
                body: bot.applicationcommandsArray,
            }
        );

        console.log("Successfully loaded application commands globablly to Discord API");
    } catch (e) {
        console.log(`Unable to load application commands to Discord API: ${e.message}`)
    }
};