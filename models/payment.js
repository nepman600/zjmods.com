var mongoose = require('../db')

var schema = new mongoose.Schema({
    gameID: {
        type: String,
        require: true,
        unique: true
    },
    date: {
        type: Date,
        require: true
    },
    region: {
        type: String,
        require: true
    }
})

exports.Payment = mongoose.model('Payment', schema)