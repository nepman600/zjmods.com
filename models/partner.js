var mongoose = require('../db')

var schema = new mongoose.Schema({
    img: {
        type: String,
        require: true
    },
    title: {
        type: String
    },
    region: {
        type: String,
        require: true
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
    },
    visible: {
        type: Boolean
    },
    date_visible: {
        type: Date
    }
})

exports.Partner = mongoose.model('Partner', schema)