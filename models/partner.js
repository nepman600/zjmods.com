var mongoose = require('../db')

var schema = new mongoose.Schema({
    img: {
        type: String,
        require: true
    },
    title: {
        type: String
    },
    period: {
        type: Number,
        require: true
    },
    click_limit: {
        type: Number,
        require: true
    },
    click_real: {
        type: Number
    },
    sort: {
        type: Number,
        require: true,
        unique: true
    }
})

exports.Partner = mongoose.model('Partner', schema)