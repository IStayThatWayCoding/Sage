const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
const { sendResponse } = require("../../../utils/utils");
  
  module.exports = {
    structure: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Manually emits an event")
        .addStringOption((option =>
                option
                    .setName('event')
                    .setDescription("Event to emit")
                    .setRequired(true)
                    .addChoices(
                        { name: "guildMemberAdd", value: "guildMemberAdd" }
          ))
        )
        .addUserOption((option =>
                option
                    .setName("user")
                    .setDescription("The user you are intending to ban")
                    .setRequired(true)
            )
        ),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {

        const staffServer = bot.guilds.cache.get(process.env.STAFF_SERVER)
        const logChannel = staffServer.channels.cache.get(process.env.EVENTS_CHANNEL);

        let { member, options } = interaction;

        let target = options.getMember("user") || member;

        async function sendEmbed(event){
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true}) })
                .setDescription(`\`${event}\` was emitted on **${target}** by ${member}`)
                .setColor("Blurple")
                .setTimestamp()

            logChannel.send({
                embeds: [embed]
            })
            console.log(member)
        }

        const avatarURL = bot.user.avatarURL({ format: 'png', size: 256 });

        
        let targetID = target.user.id || member.id;

        await interaction.deferReply({ ephemeral: true })

        switch (options.getString('event')) {
            case "guildMemberAdd": {
                bot.emit('guildMemberAdd', target)
                sendResponse(interaction, `Event \`guildMemberAdd\` has been emitted on ${target}`)
                sendEmbed('guildMemberAdd')
            }
            break;
            
        }
        
    }}