var path = require('path')

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

    /*q=bae36320f395b9fb5e6f9f8e6cb8b319&token=32&cid=2024&ver=076&stok=1321
    2024(cid)*token+stok = ID(int)
    if( md5(secret+ID) == q )*/
    var id = parseInt(req.query.cid) * parseInt(req.query.token) + parseInt(req.query.stok)
    //if()
}

exports.backend = function (req, res) {
    res.render('backend.pug', {page: 'Админка'})
}