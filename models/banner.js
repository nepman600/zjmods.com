var mongoose = require('../db')

var schema = new mongoose.Schema({
    img: {
        type: String
    },
    title: {
        type: String
    },
    link: {
        type: String
    },
    desc: {
        type: String
    },
    sort: {
        type: Number,
        require: true,
        unique: true
    }
})

exports.Banner = mongoose.model('Banner', schema)