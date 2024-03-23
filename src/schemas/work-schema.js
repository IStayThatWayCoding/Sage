const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const workSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString
}, {
    timestamps: true
})

module.exports = mongoose.model('work-schema', workSchema)