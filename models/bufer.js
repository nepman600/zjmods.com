var mongoose = require('../db')

var schema = new mongoose.Schema({
    col: {
        type: String,
        require: true
    },
    act: {
        type: String,
        require: true
    },
    data: {
        type: Object
    }
})

exports.Bufer = mongoose.model('Bufer', schema)