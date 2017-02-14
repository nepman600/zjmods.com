//var path = require('path')
var async = require('async')
var crypto = require('crypto')

var Settings = require('../models/setting').Setting
exports.frontend = function (req, res, next) {
    //res.sendFile(path.join(__dirname + '/index.html'))
    Settings.findOne({}, function (err, settings, next) {
        if (err) return next(err)

        //console.log(req.query)
        if(req.query.q)
            res.render('frontend', {settings: settings, query: req.query})
        else
            res.render('frontend', {settings: settings, from_search: true})
    })
}

exports.backend = function (req, res) {
    res.render('backend.pug', {page: 'Админка'})
}

/*var Partners = require('../models/partner').Partner
exports.extend = function (req, res, next) {
    var host = req.get('host')
    var referer = req.header('Referer')
    if( (typeof referer == 'undefined') || (referer.indexOf(host) + 1) == 0 )
        return res.redirect('/')

    var freegeoip = require('node-freegeoip')
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    freegeoip.getLocation(ip, function(err, location) {
        var region = 'en'
        if( err || location.country_code == 'RU') region = 'ru'

        //Partners.find({"visible": true, "region": region}, function (err, partners, next) {
        Partners.find({"visible": true, "region": "ru"}, function (err, partners, next) {
            //if (err) return next(err)
            if(partners != null)
                res.render('extend', {partners: partners})
        })
    })
}*/

//temp
var Client = require('../models/client').Client
exports.extend = function (req, res, next) {
    var host = req.get('host')
    var referer = req.header('Referer')
    if( (typeof referer == 'undefined') || (referer.indexOf(host) + 1) == 0 )
        return res.redirect('/')

    var ID = parseInt(req.query.cid) * parseInt(req.query.token) + parseInt(req.query.stok)

    async.waterfall([
        getSecret,
        compaireHash,
        extend,
    ], function (err, result) {
        if (err)
            return next(err)
        else
            res.render('extend', {expire: result})
    })

    function getSecret(callback) {
        Settings.findOne({}, function (err, settings) {
            callback(err, settings.secret)
        })
    }

    function compaireHash(secret, callback) {
        if( crypto.createHash('md5').update(secret + String(ID)).digest("hex") == req.query.q )
            callback(null, req.query.q)
        else
            callback(new Error('Извините Вы не являетесь нашим клиентом!'))
    }

    function extend(q, callback) {
        Client.findOne({ hash: q }, function (err, client) {
            if(err) callback(err)

            if(client === null) {
                client = new Client()
                client.hash = q
            }
            else {
                client.expire = new Date(+new Date() + 1*24*60*60*1000)
            }

            client.save(function(err, client){
                callback(err, client.expire)
            })
        })
    }
}

exports.client = function (req, res, next) {
    var ID = parseInt(req.query.cid) * parseInt(req.query.token) + parseInt(req.query.stok)

    async.waterfall([
        getSecret,
        setResponse,
    ], function (err, result) {
        if (!err)
            res.json(result)
    })

    function getSecret(callback) {
        Settings.findOne({}, function (err, settings) {
            if(err) callback(new Error())
            callback(null, settings.secret)
        })
    }

    function setResponse(secret, callback) {
        if( crypto.createHash('md5').update(secret + String(ID)).digest("hex") != req.query.q )
            callback(new Error())

        Client.findOne({ hash: req.query.q }, function (err, client) {
            if(err || client === null) callback(new Error())
            else {
                var response = {}
                var _random = Math.floor(Math.random() * (9 - 1)) + 9

                if(client.ban) {
                    response.status = 4
                    response.expire = new Date(+new Date() + _random*24*60*60*1000)
                    response.q = crypto.createHash('md5').update(secret + String(ID) + 'hz').digest("hex")
                }
                else if(client.expire <= Date.now()) {
                    response.status = 2
                    response.expire = new Date(+new Date() + _random*24*60*60*1000)
                    response.q = crypto.createHash('md5').update(secret + String(ID) + 'hz').digest("hex")
                }
                else {
                    response.q = req.query.q
                    response.expire = client.expire
                    response.status = 2
                }

                callback(err, response)
            }
        })
    }
}