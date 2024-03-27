const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    PermissionsBitField,
    ButtonStyle
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  const fetch = require('node-fetch').default;
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("scrape")
      .setDescription("Scrape a user")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addUserOption(option => option.setName('user').setDescription("User information").setRequired(true)),
    //   .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    options: {
      developers: true,
    },
    
    /**
     * @param {ExtendedClient} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (bot, interaction) => {

        await interaction.deferReply()
        
        const targetUser = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(targetUser.id).catch(console.error);

        if (!member) {
            await interaction.followUp({ content: "Couldn't fetch member details. They might not be a part of this guild.", ephemeral: true });
            return;
        }

        const userDataResponse = await fetch(`https://discord.com/api/v9/users/${targetUser.id}`, {
            headers: { "Authorization": `Bot ${process.env.TOKEN}` }
            });
            if (!userDataResponse.ok) {
            await interaction.editReply("Failed to fetch user data.");
            return;
            }
            const userData = await userDataResponse.json();

            const userInfoFields = [
                { name: "Username", value: `${member.user.tag}`, inline: true },
                { name: "User ID", value: `${member.id}`, inline: true },
                { name: "Discord Join Date", value: `${member.user.createdAt.toUTCString()}`, inline: false },
                { name: "Nitro Status", value: `${userData.premium_type === 1 ? "Nitro Classic" : userData.premium_type === 2 ? "Nitro" : "None"}`, inline: false}
            ];
 
            const memberInfoFields = [
                { name: "Guild Join Date", value: `${member.joinedAt.toUTCString()}`, inline: true },
                { name: "Nickname", value: `${member.nickname || "None"}`, inline: true },
                { name: "Boosting Since", value: `${member.premiumSince ? member.premiumSince.toUTCString() : "Not Boosting"}`, inline: false },
            ];
 
            const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => role.toString());
            if (roles.length > 0) {
                memberInfoFields.push({ name: "Roles", value: roles.join(", "), inline: false });
            }
 
            const permissions = new PermissionsBitField(member.permissions).toArray().join(", ");
            memberInfoFields.push({ name: "Permissions", value: permissions, inline: false });
 
            const userEmbed = new EmbedBuilder()
                .setTitle(`Details for ${member.user.username}`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(userInfoFields)
                .setColor("#0099FF");
 
            const memberEmbed = new EmbedBuilder()
                .setTitle(`Guild Details for ${member.user.username}`)
                .addFields(memberInfoFields)
                .setColor("#00FF00");
 
            const button = new ButtonBuilder()
                .setLabel("View Guild Data")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("view_raw");
            
            const button2 = new ButtonBuilder()
                .setLabel("View User JSON")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("view_user_json")
    
            const row = new ActionRowBuilder().addComponents(button, button2);
    
            await interaction.editReply({ embeds: [userEmbed, memberEmbed], components: [row] });
    
            const collector = interaction.channel.createMessageComponentCollector();
    
            collector.on('collect', async i => {
                if (i.customId === "view_raw") {
                    const rawUserData = JSON.stringify(member, null, 4).substring(0, 4000); 
                    await i.reply({ content: `\`\`\`json\n${rawUserData}\n\`\`\``, ephemeral: true });
                } else if (i.customId === "view_user_json") {
                    const jsonUserData = JSON.stringify(userData, null, 4).substring(0, 4000);
                    await i.reply({ content: `\`\`\`json\n${jsonUserData}\n\`\`\``, ephemeral: true })
                }
            });
        }
     
};