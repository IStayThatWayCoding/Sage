const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
  CommandInteraction,
  Message,
} = require("discord.js");
const { sendResponse } = require("../../../utils/utils");
const ExtendedClient = require("../../../class/ExtendedClient");
const rankSchema = require("../../../schemas/rank-schem");
const mongoose = require("../../../handlers/mongoose");
const Canvas = require("canvas");
const path = require("path");

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : Math.sign(num) * Math.abs(num);
}

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your rank!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to fetch. Leave blank to use on yourself.")
        .setRequired(false)
    ),
  /**
   * @param {ExtendedClient} bot
   * @param {ChatInputCommandInteraction} interaction
   * @param {Message} message
   */

  run: async (bot, interaction, message) => {
    const { member, options } = interaction;

    await interaction.deferReply().catch(err => console.error(`${path.basename(__filename)} There was a problem deferring an interaction: `, err));

    const target = options.getMember("user") || member;
    const targetId = target?.user?.id || member?.id;

    // Load default images
    const background = await Canvas.loadImage(
      "./src/images/ranks/rankbg22.png"
    );

    const results = await rankSchema.find({ id: targetId });
    // If there are no results
    if (results.length === 0) return sendResponse(interaction, `${target.user.username} isn't ranked yet. They need to send some messages to earn XP`);

    for (const info of results) {
        let { username, rank, level, msgCount, xxp, xxxp } = info;

        const rankPos = parseInt(rank);
        const canvas = Canvas.createCanvas(930, 280);
        const ctx = canvas.getContext("2d");

        // Stretch background to the size of the canvas
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Not the same as rankPos, this is technically 'level' but we call it 'rank' as it coincides with our rank roles
      ctx.font = "105px osaka";
      ctx.fillStyle = "#f7b7f7";
      ctx.fillText(`${level}`, canvas.width / 2.9, canvas.height / 4);

        // Trim long usernames
        if (username?.length > 20) username = username.slice(0, 20) + "..";
        ctx.font = "46px orbitron";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(username, 213, 140);

        // Format numbers greater than 999
        let xp2 = kFormatter(xxxp);
        let xp3 = kFormatter(xxp);
        let count = kFormatter(msgCount);

        // Message count
        ctx.font = "26px orbitron";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Message Count: ${count}`, 213, 220);

        // Current xp and xp needed
        ctx.font = "26px orbitron";
        ctx.fillStyle = "#3d29a8";
        ctx.textAlign = 'center';
        ctx.fillText(`${xp3} / ${xp2} XP`, canvas.width / 3.0, canvas.height / 1.035);

        //       //   canvas.width / 2.455,
//       //   canvas.height / 1.035

        // Position in the leaderboard
        if (rankPos.length >= 5) {
            ctx.font = "45px grotesk";
        } else if (rankPos.length >= 3) {
            ctx.font = "50px grotesk";
        } else {
            ctx.font = "60px grotesk";
        }

        // Flip the canvas so the XP bar fills counter-clockwise
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        const percentage = Math.floor((xxp / xxxp) * 100);
        // // Outter XP bar
        // ctx.beginPath();
        // ctx.lineWidth = 30;
        // ctx.strokeStyle = "#484B4E";
        // ctx.arc(190, 122, 95, 0, 2 * Math.PI, true);
        // ctx.stroke();
        // // Inner XP bar
        // ctx.beginPath();
        // ctx.lineWidth = 20;
        // ctx.strokeStyle = "#f7b7f7";
        // ctx.arc(190, 122, 95, 1.5 * Math.PI, (Math.PI * 2) / (100 / percentage) - (Math.PI / 2), false);
        // ctx.stroke();

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Draw a rounded rectangle to crop our avatar into
        function roundedImage(x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
        roundedImage(25, 77, 150, 150, 50);
        ctx.clip();

        // Get a small res version of the user's avatar and draw it onto the canvas
        const avatar = await Canvas.loadImage(target?.user.displayAvatarURL({ extension: 'png', size: 128 }));
        ctx.drawImage(avatar, 25, 77, 150, 150);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), "profile-image.png");

        sendResponse(interaction, ``, [], [attachment]);



//     for (const info of results) {
//       let { username, rank, level, msgCount, xxp, xxxp } = info;

//       const rankPos = parseInt(rank);
//       const canvas = Canvas.createCanvas(930, 280);
//       const ctx = canvas.getContext("2d");

//       // Stretch background to the size of the canvas
//       ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

//       // ctx.fillStyle = "rgba(0,0,0,0.5)";
//       // ctx.fillRect(20, 30, canvas.width - 40, canvas.height - 60);

//       let userDiscrim = username;
//       if (userDiscrim.length > 30) {
//         ctx.font = "30px grotesk";
//         userDiscrim = userDiscrim.slice(0, 25) + "...";
//       } else if (userDiscrim.legnth > 20) {
//         ctx.font = "30px grotesk";
//       } else {
//         ctx.font = "37px grotesk";
//       }
//       ctx.fillStyle = "#ffffff";
//       ctx.fillText(userDiscrim, canvas.width / 3.8, canvas.height / 2.8);

//       ctx.font = "105px osaka";
//       ctx.fillStyle = "#f7b7f7";
//       ctx.fillText(`${level}`, canvas.width / 2.9, canvas.height / 4);

//       let xp2 = kFormatter(xxxp);
//       let xp3 = kFormatter(xxp);
//       let count = kFormatter(msgCount);

//       ctx.font = "30px orbitron";
//       ctx.fillStyle = "#ffffff";
//       ctx.textAlign = "right";
//       ctx.fillText(
//         `Message Count ${count}`,
//         canvas.width / 1.16,
//         canvas.height / 1.6
//       );

//       const percentage = Math.floor((xxp / xxxp) * 100);
//       const roundedPercent = Math.round(percentage);

//       const testPerc = 100;
//       for (let i = 0; i < testPerc; i++) {
//         ctx.beginPath();
//         ctx.lineWidth = 14;
//         ctx.strokeStyle = "#48484E";
//         ctx.fillStyle = "#48484E";
//         // ctx.arc(260 + i * 5.32, 205, 8, 0, Math.PI * 2, true);
//         ctx.arc(30 + i * 5.32, 261.7, 8, 0, Math.PI * 2, true);
//         ctx.stroke();
//         ctx.fill();
//       }

//       for (let i = 0; i < roundedPercent; i++) {
//         ctx.beginPath();
//         ctx.lineWidth = 14;
//         ctx.strokeStyle = "#3e29a9";
//         ctx.fillStyle = "#3e29a9";
//         ctx.arc(30 + i * 5.32, 261.7, 5.5, 0, Math.PI * 2, true);
//         ctx.stroke();
//         ctx.fill();
//       }

//       //TEXT
//       // ctx.font = "24px orbitron";
//       // ctx.fillStyle = "#ffffff";
//       // ctx.fillText(
//       //   `${xp3} / ${xp2} XP`,
//       //   canvas.width / 2.455,
//       //   canvas.height / 1.035
//       // );

//       // // bar
//       // ctx.beginPath();
//       // ctx.arc(140, 140, 80, 0, Math.PI * 2, true);
//       // ctx.closePath();
//       // ctx.clip();

//       function roundedImage(x, y, width, height, radius) {
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//     }
//     roundedImage(55, 55, 170, 170, 50);
//     ctx.clip();

//     // Get a small res version of the user's avatar and draw it onto the canvas
//     const avatar = await Canvas.loadImage(target?.user.displayAvatarURL({ extension: 'png', size: 128 }));
//     ctx.drawImage(avatar, 55, 55, 170, 170);

//     const attachment = new AttachmentBuilder(canvas.toBuffer(), "profile-image.png");

//     sendResponse(interaction, ``, [], [attachment]);
    }
  },
};
