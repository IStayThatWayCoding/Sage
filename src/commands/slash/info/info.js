const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("discord.js");
const { sendReplyWithMention } = require('../../../utils/utils')
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require('../../../config')

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("info")
    .setDescription(
      "Gives specific information on a specific function of the server"
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category you want information about")
        .setRequired(true)
        .addChoices(
          { name: "Levels", value: "levels" },
          { name: "Roles", value: "roles" },
          { name: "Oasis", value: "oasis" },
          { name: "Sage", value: "sage" },
          { name: "Content Creator", value: "content-creator" }
        )
    ),
  /**
   * @param {ExtendedClient} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const { options } = interaction;
    const choice = options.getString('category');

    const responses = new Map([
        ['levels', `### *Level System*
The leveling system here in ${interaction.guild.name} is unique to other servers, as it is completely custom. As you level up, you will start to gain more xp, getting you closer to that next level rank!\n\n**HOW IT WORKS** - Each user will gain a range of xp per minute. Once you gain xp, a timer will start, preventing you from gaining xp until after *one minute*, when the timer goes away. Some channels in the server are **XP disabled**, meaning you CANNOT gain xp in those channels. Looking in the channel topic will help determine if you can gain xp there or not. As you level up, you can gain perks! You can check out those perks in the <#903524420826591272> channel!\n\n**LEVEL MILESTONES** - These levels are the **milestones** of the server:\n\nLevel 5\nLevel 10\nLevel 15\nLevel 20\nLevel 25\nLevel 30\nLevel 35\nLevel 40\nLevel 45\nLevel 50\nLevel 55\nLevel 60\nLevel 65\nLevel 70\nLevel 75\nLevel 75\nLevel 80\nLevel 85+\n\nSome of those milestones comes with perks for you to enjoy for leveling up! More perks will come in the future! :)\n\nIf you have any questions, please open a ticket in <#903739112027197441> and a staff member will gladly help you!`]
    ])

    sendReplyWithMention(interaction, responses.get(choice), [], [], [], true);
  },
};
