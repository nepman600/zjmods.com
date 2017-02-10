var path = require('path')
var fs = require('fs')
var Banner = require('../models/banner').Banner
var e = require('../ext/error')

exports.list = function (req, res) {
    Banner.find({}, function (err, banners) {
        //if (err) return console.error(err)
        if (err) return next(err)

        //res.json(banners)
        var data = []
        for(var i = 0; i < banners.length; i++){
            data[i] = {
                id: banners[i]._id,
                img: banners[i].img,
                title: banners[i].title,
                link: banners[i].link,
                desc: banners[i].desc,
                sort: banners[i].sort
            }
        }
        //console.log(data)
        res.render('banners/index', {data: data})
    })
}


exports.createForm = function (req, res) {
    res.render('banners/create')
}

exports.add = function (req, res, next) {
    if (!req.files)
        return next(e.setError(500, 'No files were uploaded!'))

    var img
    img = req.files.img

    var banner = new Banner({
        img: img.name,
        title: req.body.title,
        link: req.body.link,
        desc: req.body.desc,
        sort: req.body.sort
    })
    banner.save(function (err, banner, affected) {
        //console.log(req.files)
        if (!req.files)
            return next(e.setError(500, 'No files were uploaded!'))
        else if(err)
            res.render('banner/create', {err: 'Ошибка!!!'})
        else {
            // Use the mv() method to place the file somewhere on your server
            img.mv(path.join(__dirname + '/../public/upload/banners/' + req.files.img.name), function(err) {
                if (err) next(err)
            })

            res.redirect('/admin/banners')
        }
    })
}

exports.editForm = function (req, res, next) {
    Banner.findById(req.params.id, function (err, banner) {
        if (err) return next(err)
        if(banner === null) return next(e.setError(404, 'Banner not found!'))
        res.render('banners/edit', {banner: banner})
    })
}

exports.edit = function (req, res, next) {
    Banner.findById(req.body.bannerID, function (err, banner) {
        if (err) return next(err)
        if(banner === null) return next(e.setError(404, 'Banner not found!'))

        //console.log(req.files.img)
        var imgPath
        //if (!req.files)
        if(req.files.img)
            imgPath = req.files.img.name
        else {
            imgPath = req.body.img_old
        }

        banner.img = imgPath
        banner.title = req.body.title
        banner.link = req.body.link
        banner.desc = req.body.desc
        banner.sort = req.body.sort
        banner.save(function (err, updatedUser) {
            if(err) return res.render('banner/edit', {err: 'Ошибка!!!'})
            //if (err) return next(err)

            if(req.files.img) {
                req.files.img.mv(path.join(__dirname + '/../public/upload/banners/' + req.files.img.name), function(err) {
                    if (err) next(err)
                })

                fs.unlink(path.join(__dirname + '/../public/upload/banners/' + req.body.img_old))
            }

            res.redirect('/admin/banners')
        })
    })
}

exports.delete = function (req, res, next) {
    Banner.findById(req.params.id, function (err, banner) {
        if (err) return next(err)
        if(banner === null) return next(e.setError(404, 'Banner not found!'))

        //res.json(banner)
        Banner.findByIdAndRemove(req.params.id, function (err, banner) {
            fs.unlink(path.join(__dirname + '/../public/upload/banners/' + banner.img))

            var response = {
                message: "Banner successfully deleted",
                id: banner._id
            }
            res.send(response)
        })
    })
}