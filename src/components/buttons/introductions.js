const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { sendResponse } = require('../../utils/utils');

module.exports = {
    customId: 'intro-info',
    /**
     * 
     * @param {ExtendedClient} bot
     * @param {ButtonInteraction} interaction 
     */
    run: async (bot, interaction) => {
        await interaction.deferReply({ephemeral: true})

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("Introduce Yourself!")
            .setDescription("Introduce yourself by sharing a bit about who you are, what brings you here, and any hobbies or interests you're passionate about. Don't be shy, we're all eager to get to know you better!\n\nTemplate:\n\n🌟 **Name/Nickname:** [Your Name or Preferred Nickname]\n🌍 **Region**: [Where you're from]\n🔥 **Interests/Hobbies:** [Your Hobbies or Interests]\n📚 **Something Interesting About Me:** [Share a Fun Fact or Unique Trait]\n❓ **Any Other Information**")

        sendResponse(interaction, ``, [embed], [], [], true)
    }
}