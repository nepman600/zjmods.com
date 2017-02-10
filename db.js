var db = require('mongoose')
//db.Promise = require('bluebird')
//db.connect('mongodb://localhost/db1')
db.connect('mongodb://admin600:123456@ds127439.mlab.com:27439/db1')

module.exports = db