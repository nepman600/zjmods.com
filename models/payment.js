var mongoose = require('../db')

var schema = new mongoose.Schema({
    gameID: {
        type: String,
        require: true,
        unique: true
    },
    nickname: {
        type: String,
        /*require: true,
        unique: true*/
    },
    date: {
        type: Date,
        require: true
    },
    region: {
        type: String,
        require: true
    },
    count: {
        type: Number,
        default: 1,
        require: true
    }
})

exports.Payment = mongoose.model('Payment', schema)