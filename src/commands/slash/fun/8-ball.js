const { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the majic 8ball anything!'),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {

        const modal = new ModalBuilder()
            .setTitle('8ball!')
            .setCustomId('8ball-input')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('What\'s your question?')
                            .setCustomId('input')
                            .setPlaceholder('Type your question here!')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            );

        await interaction.showModal(modal);

    }
};

// const {
//   SlashCommandBuilder,
//   ModalBuilder,
//   ActionRowBuilder,
//   TextInputBuilder,
//   TextInputStyle,
//   ChatInputCommandInteraction,
// } = require("discord.js");

// const ExtendedClient = require("../../../class/ExtendedClient");

// module.exports = {
//   structure: new SlashCommandBuilder()
//     .setName("8ball")
//     .setDescription("Ask the Majic 8ball a question!"),
//   /**
//    *
//    * @param {ExtendedClient} bot
//    * @param {ChatInputCommandInteraction} interaction;
//    */
//   run: async (interaction, bot) => {
//     const modal = new ModalBuilder()
//       .setTitle("Modal Example")
//       .setCustomId("modal-example")
//       .addComponents(
//         new ActionRowBuilder().addComponents(
//           new TextInputBuilder()
//             .setLabel("What's your name?")
//             .setCustomId("name")
//             .setPlaceholder("Type your name here!")
//             .setStyle(TextInputStyle.Short)
//             .setRequired(true)
//         )
//       );

//     // await interaction.showModal(modal);
//     await interaction.reply("test")
//   },
// };

// //   const modal = new ModalBuilder()
// //     .setTitle("8ball!")
// //     .setCustomId("8ball")

// //   const textInput = new TextInputBuilder()
// //     .setCustomId("8ballInput")
// //     .setLabel("Ask your question!")
// //     .setPlaceholder("Ask your question here...")
// //     .setRequired(true)
// //     .setStyle(TextInputStyle.Short);

// //     modal.addComponents(new ActionRowBuilder().addComponents(textInput))

// //   await interaction.showModal(modal);

// //   run: async (interaction, bot) => {
// //     const modal = new ModalBuilder().setCustomId("8ball").setTitle("8Ball!");

// //     const textInput = new TextInputBuilder()
// //       .setCustomId("8ballInput")
// //       .setLabel("Ask your question!")
// //       .setRequired(true)
// //       .setStyle(TextInputStyle.Short);

// //     modal.addComponents(new ActionRowBuilder().addComponents(textInput));

// //     await interaction.showModal(modal);
// //   },
