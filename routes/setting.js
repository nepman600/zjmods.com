var Settings = require('../models/setting').Setting
var e = require('../ext/error')

exports.form = function (req, res) {
    Settings.findOne({}, function (err, settings) {
        if (err) return next(err)

        res.render('settings', {settings: settings})
    })
}

exports.save = function (req, res, next) {
    Settings.findOne({}, function (err, settings) {
        if (err) return next(err)
        //console.log(req.body.intro)
        settings.download_link = req.body.download_link
        settings.secret = req.body.secret
        settings.help_url = req.body.help_url
        settings.offer_url = req.body.offer_url
        settings.color = req.body.color
        settings.version = req.body.version
        settings.period1 = req.body.period1
        settings.period2 = req.body.period2
        settings.period3 = req.body.period3
        settings.intro = req.body.intro

        settings.save(function (err, settings, affected, next) {
            if (err) return next(err)
            res.redirect('/admin/settings')
        })
    })
}

exports.intro = function (req, res) {
    Settings.findOne({}, function (err, settings) {
        if (err) return next(err)

        res.render('intro', {intro: settings.intro})
    })
}
