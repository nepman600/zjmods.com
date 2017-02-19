var mongoose = require('../db')

var schema = new mongoose.Schema({
    hash: {
        type: String,
        require: true,
        unique: true
    },
    expire: {
        type: Date,
        require: true,
        default: new Date(+new Date() + 1*24*60*60*1000)
        //default: Date.now()
    },
    ban: {
        type: Boolean,
        default: false
    }
})

exports.Client = mongoose.model('Client', schema)