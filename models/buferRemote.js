var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        //new (winston.transports.Console)(),
        //new (winston.transports.File)({ filename: 'somefile.log' })
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'error.log',
            level: 'error'
        })
    ]
})

var mongoose = require('mongoose')

//var connRemote = mongoose.createConnection('mongodb://185.159.130.45:27017/db1')
try {
    var connRemote = mongoose.createConnection('mongodb://185.159.130.45:27017/db1', function (err) {
        if(err) {
            //console.dir(err)
            //throw new Error('Ошибка подключения к удаленной базе')
            logger.error('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack)
        }
        else {
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

            exports.BuferRemote = connRemote.model('Bufer', schema)
        }
    })
    //console.dir(connRemote)
}
catch(e) {
    //throw new Error('произошла ошибка')
    //console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)
    logger.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)
}

/*
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

exports.BuferRemote = connRemote.model('Bufer', schema)*/
