const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const begSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString
}, {
    timestamps: true
})

module.exports = mongoose.model('beg-schema', begSchema)