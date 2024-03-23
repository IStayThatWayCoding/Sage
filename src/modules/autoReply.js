const { readdirSync, readdir } = require('fs')
const ExtendedClient = require('../class/ExtendedClient')
const { Message } = require('discord.js')

/**
 * 
 * @param {ExtendedClient} bot
 * @param {Message} message
 */

module.exports = (bot, message) => {
    
    const listeners = [
        "is oasis a girl",
        "is oasis a girl?",
        "oasis girl",
        "girl oasis",
        "oasis girl?",
        "girl oasis?",
        "what are oasis's pronouns",
        "what are oasis's pronouns?",
        "oasis pronouns",
        "oasis pronouns?",
        "does oasis have pronouns",
        "does oasis have pronouns?",
        "what does oasis identify as",
        "what does oasis identify as?",
        "why does oasis sound like a guy/boy",
        "why does oasis sound like a guy",
        "why does oasis sound like a boy",
        "why does oasis sound like a guy/boy?",
        "why does oasis sound like a guy?",
        "why does oasis sound like a boy?",
        "is oasis a boy",
        "is oasis a she",
        "is oasis a boy?",
        "is oasis a she?",
        "is oasis a he or she",
        "is oasis a he or she?",
        "is oasis a woman?",
        "is oasis a woman",
        "pronouns oasis",
        "pronouns oasis?",
        "what pronouns does oasis use",
        "what pronouns does oasis use?"
    ]

    for (var i = 0; i < listeners.length; i++) {
        if (message.content.toLowerCase().includes(listeners[i])){
            message.reply("Oasis is female and her pronouns are **she/her only!**⚡️")
        }
    }
}