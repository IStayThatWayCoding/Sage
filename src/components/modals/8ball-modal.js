const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

const answers = [
	'Maybe.',
	'Certainly not.',
	'I hope so.',
	'Not in your wildest dreams.',
	'There is a good chance.',
	'Quite likely.',
	'I think so.',
	'I hope not.',
	'I hope so.',
	'Never!',
	'Fuhgeddaboudit.',
	'Ahaha! Really?!?',
	'Pfft.',
	'Sorry, bucko.',
	'Hell, yes.',
	'Hell to the no.',
	'The future is bleak.',
	'The future is uncertain.',
	'I would rather not say.',
	'Who cares?',
	'Possibly.',
	'Never, ever, ever.',
	'There is a small chance.',
	'Yes!'
];

module.exports = {
    customId: '8ball-input',
    /**
     * 
     * @param {ExtendedClient} bot
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (bot, interaction) => {

		const embed = new EmbedBuilder()
			.setTitle('8 Ball!')
			.setDescription(`${answers[Math.floor(Math.random() * answers.length)]}`)
			.setColor(3092790)
			.setFooter({
				text: `Question: ${interaction.fields.getTextInputValue("input")}`
			});

		await interaction.reply({
			embeds: [embed]
		})
	}
};

// const { SlashCommandBuilder, EmbedBuilder, ModalSubmitInteraction } = require('discord.js');
// const ExtendedClient = require('../../class/ExtendedClient');

// const answers = [
// 	'Maybe.',
// 	'Certainly not.',
// 	'I hope so.',
// 	'Not in your wildest dreams.',
// 	'There is a good chance.',
// 	'Quite likely.',
// 	'I think so.',
// 	'I hope not.',
// 	'I hope so.',
// 	'Never!',
// 	'Fuhgeddaboudit.',
// 	'Ahaha! Really?!?',
// 	'Pfft.',
// 	'Sorry, bucko.',
// 	'Hell, yes.',
// 	'Hell to the no.',
// 	'The future is bleak.',
// 	'The future is uncertain.',
// 	'I would rather not say.',
// 	'Who cares?',
// 	'Possibly.',
// 	'Never, ever, ever.',
// 	'There is a small chance.',
// 	'Yes!'
// ];

// module.exports = {
// 	customId: '8ball-modal',
// 	/**
// 	 * 
// 	 * @param {ExtendedClient} bot
// 	 * @param {ModalSubmitInteraction} interaction
// 	 */
// 	run: async (interaction, bot) => {
// 		const nameInput = interaction.fields.getTextInputValue('name');
	
// 		await interaction.reply({
// 			content: `Hey **${nameInput}**, what's up?`
// 		});
// 	  }
// 	// run: async (bot, interaction) => {
// 	// 	const ballInput = interaction.fields.getTextInputValue("8ballInput")

// 	// 	const embed = new EmbedBuilder()
// 	// 		.setTitle('8 Ball!')
// 	// 		.setDescription(`${answers[Math.floor(Math.random() * answers.length)]}`)
// 	// 		.setColor(3092790)
// 	// 		.setFooter({
// 	// 			text: `Question: ${ballInput}`
// 	// 		});

// 	// 	await interaction.reply({
// 	// 		embeds: [embed]
// 	// 	})
// 	// }
// }

// // module.exports = {
// //     data: {
// //         name: `8ball`
// //     },
// //     async execute(interaction, bot) {
        
		
// // 		const embed = new EmbedBuilder()
// // 			.setTitle('8 Ball!')
// // 			.setDescription(`${answers[Math.floor(Math.random() * answers.length)]}`)
// // 			.setColor(3092790)
// // 			.setFooter({
// // 				text: `Question: ${interaction.fields.getTextInputValue("8ballInput")}`
// // 			});
		
// // 		await interaction.reply({
// // 			embeds: [embed]
// // 		})
// //     }
// // }