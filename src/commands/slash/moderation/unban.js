const { SlashCommandBuilder, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, codeBlock, PermissionFlagsBits, hyperlink, Embed } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const warnSchema = require('../../../schemas/warnSchema');
const rules = require('../../../utils/rules')
const { uuid } = require('uuidv4');
const { sendResponse, dbCreate, dbDeleteOne } = require("../../../utils/utils");
  
module.exports = {
  structure: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option =>
        option
            .setName('user-id')
            .setDescription('The ID of the user')
            .setRequired(true)
        ))
    .addStringOption((option => 
        option
            .setName('reason')
            .setDescription('Unban reason')
            .setRequired(true)
        )),
  /**
   * @param {ExtendedClient} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const { member, guild, options } = interaction;

    await interaction.deferReply()

    const user = options.getString('user-id');
    const reason = options.getString('reason');
    const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
    const logChannel = staffServer.channels.cache.get(process.env.UNBANS_CHANNEL);
    let error;

    // Validate ID
    if (isNaN(user)) return sendResponse(interaction, `User ID must be only numbers`);

    // Fetch ban
    const fetchBan = await guild.bans.fetch(user).catch(() => { error = true });
    // Remove Ban
    await guild.bans.remove(user, { reason: reason }).catch(() => { error = true });
    // Error Notify
    if (error) return sendResponse(interaction, `${target} was not found on the list!`)
    //Log
    let log = new EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: false }) })
        .setDescription(`**Member:** ${fetchBan.user.username} *(${fetchBan.user.id})*
        **Reason:** ${reason}`)
            .setFooter({ text: `Unban • ${uuid()}`})
            .setTimestamp();
    
    logChannel.send({
        embeds: [log]
    }).catch(err => console.error(err));

    sendResponse(interaction, `✅ Reversal of previous action initiated. **${fetchBan.user.username}** unbanned for recalibration of system dynamics. Reason: ${reason}`)
    
}}