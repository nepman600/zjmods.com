var mongoose = require('../db')
var crypto = require('crypto')

var schema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    hash: {
        type: String,
        require: true
    },
    salt: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

schema.methods.encryptPass = function (pass) {
    return crypto.createHmac('sha1', this.salt).update(pass).digest('hex')
}

schema.virtual('pass').set(function (pass) {
    this._plainPass = pass
    this.salt = Math.random() + ''
    this.hash = this.encryptPass(pass)
}).get(function () {return this._plainPass})

schema.methods.checkPass = function (pass) {
    return this.encryptPass(pass) === this.hash
}

exports.User = mongoose.model('User', schema)