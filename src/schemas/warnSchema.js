const mongoose = require('mongoose')

const warnSchema = mongoose.Schema({
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
    warnID: {
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
    warnCount: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('warnings', warnSchema)
