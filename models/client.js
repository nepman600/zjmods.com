var mongoose = require('../db')

var schema = new mongoose.Schema({
    hash: {
        type: String,
        require: true
    },
    expire: {
        type: Date,
        require: true,
        default: Date.now() + 86400
    },
    ban: {
        type: Boolean,
        default: false
    }
})

exports.Client = mongoose.model('Client', schema)