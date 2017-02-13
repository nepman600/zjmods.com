var path = require('path')
var fs = require('fs')
var Partner = require('../models/partner').Partner
var Settings = require('../models/setting').Setting
var e = require('../ext/error')

exports.list = function (req, res) {
    Partner.find({}, function (err, partners) {
        if (err) return next(err)

        //res.json(partners)
        var data = []
        for(var i = 0; i < partners.length; i++){
            data[i] = {
                id: partners[i]._id,
                img: partners[i].img,
                title: partners[i].title,
                region: partners[i].region,
                period: partners[i].period,
                click_limit: partners[i].click_limit,
                click_real: partners[i].click_real,
                sort: partners[i].sort,
                visible: partners[i].visible,
                link: partners[i].link
            }
        }
        //console.log(data)
        res.render('partners/index', {data: data})
    })
}


exports.createForm = function (req, res) {
    Settings.findOne({}, function (err, settings, next) {
        if (err) return next(err)
        var periods = [settings.period1, settings.period2, settings.period3]
        res.render('partners/create', {periods: periods})
    })
}

exports.add = function (req, res, next) {
    if (!req.files)
        return next(e.setError(500, 'No files were uploaded!'))

    var img
    img = req.files.img

    var partner = new Partner({
        img: img.name,
        title: req.body.title,
        period: req.body.period,
        click_limit: req.body.click_limit,
        click_real: 0,
        sort: req.body.sort,
        visible: true,
        region: req.body.region,
        link: req.body.link
    })
    partner.save(function (err, partner, affected) {
        if(err)
            res.render('partner/create', {err: 'Ошибка!!!'})
        else {
            // Use the mv() method to place the file somewhere on your server
            img.mv(path.join(__dirname + '/../public/upload/partners/' + req.files.img.name), function(err) {
                if (err) next(err)
            })

            res.redirect('/admin/partners')
        }
    })
}

exports.editForm = function (req, res, next) {
    var data = {}
    Partner.findById(req.params.id, function (err, partner) {
        if (err) return next(err)
        if(partner === null) return next(e.setError(404, 'partner not found!'))
        data.partner = partner

        Settings.findOne({}, function (err, settings, next) {
            if (err) return next(err)
            var periods = [settings.period1, settings.period2, settings.period3]
            data.periods = periods
            res.render('partners/edit', {data: data})
        })
    })
}

exports.edit = function (req, res, next) {
    Partner.findById(req.body.partnerID, function (err, partner) {
        if (err) return next(err)
        if(partner === null) return next(e.setError(404, 'partner not found!'))

        //console.log(req.files.img)
        var imgPath
        //if (!req.files)
        if(req.files.img)
            imgPath = req.files.img.name
        else {
            imgPath = req.body.img_old
        }

        partner.img = imgPath
        partner.title = req.body.title
        partner.click_limit = req.body.click_limit
        partner.period = req.body.period
        partner.sort = req.body.sort
        region: req.body.region
        link: req.body.link

        partner.save(function (err, updatedPartner) {
            if(err) return res.render('partner/edit', {err: 'Ошибка!!!'})
            //if (err) return next(err)

            if(req.files.img) {
                req.files.img.mv(path.join(__dirname + '/../public/upload/partners/' + req.files.img.name), function(err) {
                    if (err) next(err)
                })

                fs.unlink(path.join(__dirname + '/../public/upload/partners/' + req.body.img_old))
            }

            res.redirect('/admin/partners')
        })
    })
}

exports.delete = function (req, res, next) {
    Partner.findById(req.params.id, function (err, partner) {
        if (err) return next(err)
        if(partner === null) return next(e.setError(404, 'partner not found!'))

        //res.json(partner)
        Partner.findByIdAndRemove(req.params.id, function (err, partner) {
            fs.unlink(path.join(__dirname + '/../public/upload/partners/' + partner.img))

            var response = {
                message: "Partner successfully deleted",
                id: partner._id
            }
            res.send(response)
        })
    })
}

exports.click = function (req, res, next) {
    Partner.findById(req.params.id, function (err, partner) {
        if (err) return next(err)
        if(partner === null) return next(e.setError(404, 'partner not found!'))

        if( partner.click_limit == partner.click_real + 1 ){
            partner.click_real = 0
            partner.visible = false
        }
        else
            partner.click_real = partner.click_real + 1

        //console.log(partner.visible)
        partner.save(function (err, updatedPartner) {
            if (err) return next(err)
            //return res.redirect('/extend')
            var response = {
                status: 200
            }
            res.send(response)
        })
    })
}