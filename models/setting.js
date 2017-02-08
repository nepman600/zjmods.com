var mongoose = require('../db')

var schema = new mongoose.Schema({
    download_link: {
        type: String,
        require: true
    },
    secret: {
        type: String,
        require: true
    },
    help_url: {
        type: String
    },
    offer_url: {
        type: String
    },
    color: {
        type: String
    },
    version: {
        type: String
    },
    period1: {
        type: Number,
        require: true
    },
    period2: {
        type: Number,
        require: true
    },
    period3: {
        type: Number,
        require: true
    }
})


exports.Setting = mongoose.model('Setting', schema)