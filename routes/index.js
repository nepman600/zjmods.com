//var path = require('path')
var async = require('async')
var crypto = require('crypto')

var Settings = require('../models/setting').Setting
var Banners = require('../models/banner').Banner
var Bufer = require('../models/bufer').Bufer
//var Payment = require('../models/payment').Payment

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
    ], function (err, expire) {
        if (err)
            return next(err)
        else {
            var synchro_date = new Date(+Date.now() + 1*27*60*60*1000)
            res.render('extend', {expire: synchro_date})
        }
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

            var bufer = new Bufer()
            bufer.col = 'clients'

            if(client === null) {
                bufer.act = 'add'
                client = new Client()
                client.hash = q
                client.expire = new Date(+new Date() + 1*24*60*60*1000)
                //client.expire = new Date(Date.now() + (parseInt(req.query.time) - Date.now()) + 1*32*60*60*1000 )
            }
            else {
                bufer.act = 'edit'
                client.expire = new Date(+new Date() + 1*24*60*60*1000)
                //console.log(client.expire)
            }

            client.save(function(err, client){
                //bufer.data = client
                bufer.data = {
                    //id: JSON.stringify(client._id).replace('"', ''),
                    id: JSON.stringify(client._id),
                    hash: client.hash,
                    ban: client.ban,
                    expire: client.expire
                }

                bufer.save(function (err, bufer, affected) {
                    /*if(err){
                     console.error(err)
                     }*/
                })

                callback(err, client.expire)
            })
        })
    }
}

/*exports.payment = function (req, res, next) {
    var ID = parseInt(req.body.cid) * parseInt(req.body.token) + parseInt(req.body.stok)

    if (typeof req.body.q != 'undefined')
    {
        if( crypto.createHash('md5').update(req.body.cid + req.body.date + String(ID)).digest("hex") == req.body.q )
        {
            var arDate = req.body.date.split('.')
            //console.log(new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]))

            Payment.findOne({gameID:ID}, function (err, client) {
                //if (err) return next(err)
                if(err) res.send(err)
                else if(client === null) {
                    var payment = new Payment({
                        gameID: ID,
                        date: new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]),
                        region: req.body.reg
                    })

                    payment.save(function (err, payment, affected) {
                        if(err){
                            res.send(err)
                        }
                        else {
                            res.send('success!')
                            //res.json(payment)
                        }
                    })
                }
                else {
                    client.last_visit = new Date(Date.now())
                    client.save(function (err, updatedRecord, affected) {
                        if(err){
                            res.send(err)
                        }
                        else {
                            res.send('success!')
                            //res.json(updatedRecord)
                        }
                    })
                }
            })
        }
        else
            res.send('success!')
    }
    else
    {
        var arDate = req.body.date.split('.')
        //console.log(new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]))

        Payment.findOne({gameID:ID}, function (err, client) {
            //if (err) return next(err)
            if(err) res.send(err)
            else if(client === null) {
                var payment = new Payment({
                    gameID: ID,
                    date: new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]),
                    region: req.body.reg
                })

                payment.save(function (err, payment, affected) {
                    if(err){
                        res.send(err)
                    }
                    else {
                        res.send('success!')
                        //res.json(payment)
                    }
                })
            }
            else {
                client.last_visit = new Date(Date.now())
                client.save(function (err, updatedRecord, affected) {
                    if(err){
                        res.send(err)
                    }
                    else {
                        res.send('success!')
                        //res.json(updatedRecord)
                    }
                })
            }
        })
    }
}*/

exports.client = function (req, res, next) {
    var ID = parseInt(req.body.cid) * parseInt(req.body.token) + parseInt(req.body.stok)

    async.waterfall([
        getSettings,
        setResponse,
    ], function (err, result) {
        var year = "" + result.expire.getFullYear();
        var month = "" + (result.expire.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        var day = "" + result.expire.getDate(); if (day.length == 1) { day = "0" + day; }
        /*var hour = "" + result.expire.getHours(); if (hour.length == 1) { hour = "0" + hour; }
         var minute = "" + result.expire.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
         var second = "" + result.expire.getSeconds(); if (second.length == 1) { second = "0" + second; }
         var expire = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second*/
        var arDate = result.expire.toUTCString().split(' ')
        var expire = year + "-" + month + "-" + day + " " + arDate[4]

        var hash = crypto.createHash('md5').update(result.q + 'cid=' + req.body.cid).digest("hex")

        //var delta  = parseInt(req.body.time) - Date.now()
        //res.send(hash + ',' + expire + ',' + result.status + ',' + delta)

        res.send(hash + ',' + expire + ',' + result.status + ',' + result.version)
    })

    function getSettings(callback) {
        Settings.findOne({}, function (err, settings) {
            if(err) callback(new Error())
            callback(null, {secret: settings.secret, version: settings.version})
        })
    }

    function setResponse(settings, callback) {
        var response = {}
        var _random = Math.floor(Math.random() * (9 - 1)) + 9

        if( crypto.createHash('md5').update(settings.secret + String(ID)).digest("hex") != req.body.q ) {
            //callback(new Error())
            response.status = 5
            response.expire = new Date(+new Date() + _random*24*60*60*1000)
            response.q = crypto.createHash('md5').update(settings.secret + String(ID) + 'hz').digest("hex")
            response.version = settings.version
            //callback(null, response)
        }

        Client.findOne({ hash: req.body.q }, function (err, client) {
            //var response = {}
            //var _random = Math.floor(Math.random() * (9 - 1)) + 9

            if(err || client === null) {
                //callback(new Error())
                response.status = 5
                response.expire = new Date(+new Date() + _random*24*60*60*1000)
                response.q = crypto.createHash('md5').update(settings.secret + String(ID) + 'hz').digest("hex")
                response.version = settings.version
            }
            else {
                /*console.log(client.expire)
                 console.log(Date.parse(client.expire))
                 console.log(Date.now())
                 console.log(new Date())*/
                if(client.ban) {
                    response.status = 4
                    response.expire = new Date(+new Date() + _random*24*60*60*1000)
                    response.q = crypto.createHash('md5').update(settings.secret + String(ID) + 'hz').digest("hex")
                    response.version = settings.version
                }
                else if( Date.parse(client.expire) < Date.now() ) {
                    response.status = 2
                    response.expire = new Date(+new Date() + _random*24*60*60*1000)
                    response.q = crypto.createHash('md5').update(settings.secret + String(ID) + 'hz').digest("hex")
                    response.version = settings.version
                }
                else {
                    response.q = req.body.q
                    response.status = 2
                    //response.expire = client.expire
                    //response.expire = new Date(+Date.now() + 1*27*60*60*1000)
                    response.expire = new Date(Date.parse(client.expire) + 1*3*60*60*1000)
                    response.version = settings.version
                }
            }

            callback(err, response)
        })
    }
}

/*exports.client = function (req, res, next) {
 res.json(req.body)
 }*/

