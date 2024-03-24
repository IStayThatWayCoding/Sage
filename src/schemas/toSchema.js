const mongoose = require('mongoose')

const toSchema = mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    toID: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    authorTag: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    timeoutCount: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('timeouts', toSchema)
