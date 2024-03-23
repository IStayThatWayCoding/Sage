const { Schema, mongoose } = require('mongoose');

const rankSchema = Schema({

    rank: Number,
    id: String,
    username: String,
    discrim: String,
    avatar: String,
    level: String,
    msgCount: String,
    xp: String,
    xxp: String,
    xxxp: String
})

module.exports = mongoose.model('ranks', rankSchema)