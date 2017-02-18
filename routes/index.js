//var path = require('path')
var async = require('async')
var crypto = require('crypto')

var Settings = require('../models/setting').Setting
var Banners = require('../models/banner').Banner
/*exports.frontend = function (req, res, next) {
 //res.sendFile(path.join(__dirname + '/index.html'))
 Settings.findOne({}, function (err, settings, next) {
 if (err) return next(err)

 //console.log(req.query)
 if(req.query.q)
 res.render('frontend', {settings: settings, query: req.query})
 else
 res.render('frontend', {settings: settings, from_search: true})
 })
 }*/

exports.frontend = function (req, res, next) {
    async.parallel({
        settings: function(callback) {
            Settings.findOne({}, function (err, settings) {
                if(err) callback(err)
                callback(null, settings)
            })
        },
        banners: function(callback) {
            Banners.find({}, function (err, banners) {
                if(err) callback(err)
                callback(null, banners)
            }).sort({ sort: 1 })
        }
    }, function(err, results) {
        if(err) next(err)

        //res.json(results.banners)
        if(req.query.q)
            res.render('frontend', {settings: results.settings, query: req.query, banners: JSON.stringify(results.banners)})
        else
            res.render('frontend', {settings: results.settings, from_search: true, banners: JSON.stringify(results.banners)})
    })
}

exports.frontendEn = function (req, res, next) {
    async.parallel({
        settings: function(callback) {
            Settings.findOne({}, function (err, settings) {
                if(err) callback(err)
                callback(null, settings)
            })
        },
        banners: function(callback) {
            Banners.find({}, function (err, banners) {
                if(err) callback(err)
                callback(null, banners)
            }).sort({ sort: 1 })
        }
    }, function(err, results) {
        if(err) next(err)

        //res.json(results.banners)
        if(req.query.q)
            res.render('frontendEn', {settings: results.settings, query: req.query, banners: JSON.stringify(results.banners)})
        else
            res.render('frontendEn', {settings: results.settings, from_search: true, banners: JSON.stringify(results.banners)})
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
                client.expire = new Date(Date.now() + (parseInt(req.query.time) - Date.now()) + 1*24*60*60*1000 )
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

/*exports.client = function (req, res, next) {
 var ID = parseInt(req.query.cid) * parseInt(req.query.token) + parseInt(req.query.stok)

 async.waterfall([
 getSecret,
 setResponse,
 ], function (err, result) {
 if (!err)
 //res.json(result)
 var expire = result.expire.toISOString().split('T')[0] + ' ' + result.expire.getHours() + ':' + result.expire.getMinutes() + ':' + result.expire.getSeconds()
 res.send(result.q + ',' + expire + ',' + result.status)
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
 else if( Date.parse(client.expire) < Date.parse(Date.now()) ) {
 response.status = 2
 response.expire = new Date(+new Date() + _random*24*60*60*1000)
 //console.log(Date.parse(response.expire))
 response.q = crypto.createHash('md5').update(secret + String(ID) + 'hz').digest("hex")
 }
 else {
 response.q = req.query.q
 response.status = 2
 response.expire = client.expire
 }

 callback(err, response)
 }
 })
 }
 }*/

exports.client = function (req, res, next) {
    var ID = parseInt(req.body.cid) * parseInt(req.body.token) + parseInt(req.body.stok)

    async.waterfall([
        getSecret,
        setResponse,
    ], function (err, result) {
        if (!err) {
            //res.json(result)
            //var expire = result.expire.toISOString().split('T')[0] + ' ' + result.expire.getHours() + ':' + result.expire.getMinutes() + ':' + result.expire.getSeconds()
            var year = "" + result.expire.getFullYear();
            var month = "" + (result.expire.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
            var day = "" + result.expire.getDate(); if (day.length == 1) { day = "0" + day; }
            var hour = "" + result.expire.getHours(); if (hour.length == 1) { hour = "0" + hour; }
            var minute = "" + result.expire.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
            var second = "" + result.expire.getSeconds(); if (second.length == 1) { second = "0" + second; }
            var expire = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second

            var hash = crypto.createHash('md5').update(result.q + 'cid=' + req.body.cid).digest("hex")
            res.send(hash + ',' + expire + ',' + result.status)
        }
    })

    function getSecret(callback) {
        Settings.findOne({}, function (err, settings) {
            if(err) callback(new Error())
            callback(null, settings.secret)
        })
    }

    function setResponse(secret, callback) {
        if( crypto.createHash('md5').update(secret + String(ID)).digest("hex") != req.body.q )
            callback(new Error())

        Client.findOne({ hash: req.body.q }, function (err, client) {
            if(err || client === null) callback(new Error())
            else {
                var response = {}
                var _random = Math.floor(Math.random() * (9 - 1)) + 9

                if(client.ban) {
                    response.status = 4
                    response.expire = new Date(+new Date() + _random*24*60*60*1000)
                    response.q = crypto.createHash('md5').update(secret + String(ID) + 'hz').digest("hex")
                }
                else if( Date.parse(client.expire) < Date.parse(Date.now()) ) {
                    response.status = 2
                    response.expire = new Date(+new Date() + _random*24*60*60*1000)
                    //console.log(Date.parse(response.expire))
                    response.q = crypto.createHash('md5').update(secret + String(ID) + 'hz').digest("hex")
                }
                else {
                    response.q = req.body.q
                    response.status = 2
                    response.expire = client.expire
                }

                callback(err, response)
            }
        })
    }
}

/*exports.client = function (req, res, next) {
 res.json(req.body)
 }*/

