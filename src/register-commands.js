require('dotenv').config()
const { REST, Routes, ApplicationCommandOptionType, SlashCommandBuilder} = require('discord.js');

// const commands = new SlashCommandBuilder()
//     .setName('help')
//     .setDescription('Help Command')
//     .addStringOption(option =>
//         option.setName('input')
//             .setDescription('Help category')
//             .setRequired(true)
//             .addChoices(
//                 { name: 'databases', value: 'Database' },
//                 { name: 'files', value: 'Files' },
//         ));
// TRY AND FIX LATER

const commands = [

    { 
        name: 'hello',
        description: "Says hello or something",
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Registering slash commands...`)

        await rest.put(
            Routes.applicationGuildCommands(`${process.env.BOT_ID}`, `${process.env.GUILD_ID}`),
            { body: commands }
        )

        console.log('Slash commands registered!')

    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
})();