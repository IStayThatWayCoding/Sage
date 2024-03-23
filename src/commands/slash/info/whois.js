const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const colors = require('../../../colors.json')

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Returns information about a user')
        .addUserOption(option =>
            option
              .setName('user')
              .setDescription("Member to fetch. Leave blank to use on yourself.")
              .setRequired(false)),
    options: {
        developers: true
    },
    /**
     * @param {ExtendedClient} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const { member, options } = interaction;
        let target = options.getMember("user") || member;
        let targetID = target.user.id || member.id;

        const embed = new EmbedBuilder()
        .setColor(colors.blue_light)
        .setAuthor({ name: `${target.user.username}`})
        .setThumbnail(target.user.avatarURL())
        .setDescription(`Here is some information I found for ${target}`)
        .addFields(
            { name: "User ID", value: `${target.user.id}`, inline: true},
            { name: "Account Created:", value: `${target.user.createdAt}`, inline: true},
            { name: "Joined Server", value: `${target.joinedAt}`, inline: true},
            { name: "Highest Role", value: `${target.roles.highest}`, inline: true},
            { name: "All Roles", value: `${target.roles.cache.map(r => `${r}`).join(" | ")}`, inline: false},
        )

        interaction.reply({
            embeds: [embed]
        })

    }
};