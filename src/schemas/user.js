const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    pingedOasis: Number,
})

module.exports = mongoose.model('user', userSchema, 'users');