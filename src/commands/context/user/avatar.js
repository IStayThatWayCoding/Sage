const { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { sendResponse } = require('../../../utils/utils');
const colors = require('../../../colors.json')
module.exports = {
    structure: new ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(2),
    /**
     * @param {ExtendedClient} bot
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {

        const { guild } = interaction;
        const target = await guild.members.fetch(interaction.targetId).catch(() => { });

        await interaction.deferReply({ ephemeral: true }).catch(err => console.error(err));

        if (!target) return sendResponse(interaction, `User no longer exists`);

        const response = new EmbedBuilder()
            .setColor(colors.TRANSPARENT)
            .setAuthor({ name: `${target.user.username}`, iconURL: target.user.displayAvatarURL({ dynamic: true }) })
            .setTitle("Avatar")
            .setImage(`${target.user.displayAvatarURL({ dynamic: true })}?size=256`);

        sendResponse(interaction, ``, [response]);

    }
};