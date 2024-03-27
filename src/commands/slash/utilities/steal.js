const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
const { default: axios } = require("axios");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("steal")
      .setDescription("Steals an emoji")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
      .addStringOption((option => 
        option
            .setName("emoji")
            .setDescription("The emoji you want to steal")
            .setRequired(true)
        ))
       .addStringOption((option => 
            option
                .setName("name")
                .setDescription("The name for your emoji")
                .setRequired(true)
            )),
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {
        const { options } = interaction;

        let emoji = options.getString('emoji')?.trim();
        const name = options.getString('name');

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0]

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "You cannot steal default emojis!"})
        }

        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "You cannot steal default emojis!"})
        }

        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Added ${emoji}\nName: ${name}`)

            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            interaction.reply({ content: "This emoji cannot be added (Did you reach the limit?)"})
        })
    }}