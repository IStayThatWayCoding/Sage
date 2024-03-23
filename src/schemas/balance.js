const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    lastEditied: String,
    balance: { type: Number, default: 0}
});

module.exports = new mongoose.model('Balance', balanceSchema, 'balances')