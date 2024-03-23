module.exports = (bot, message) => {
    if(message.channel.type == 'dm'){
        const images = []

        var Attachment = (message.attachments).array()
        Attachment.forEach(function(attachment){
            console.log(attachment.url)
            images.push(`${attachment.url}\n\n`)   
        })

        if(message.attachments.size == 0){
            images.push("No Attachments Found")
        }
        console.log(images)

        const dmEmbed = new MessageEmbed()
        .setTitle('New DM')
        .setColor('RANDOM')
        .setTimestamp()
        .setDescription(`**User:** ${message.author.tag}\n**USER ID**: ${message.author.id}\n**At**: ${new Date()}\n\n**Content** \`\`\`${message.content}\`\`\`\n\n**ATTACHMENTS:**\n ${images}`)

        const DMC = bot.channels.cache.get('1048464804030992384')
        DMC.send(dmEmbed)
    }
}
