var express = require('express')
var app = express()
var path = require('path')
var bodyParser  = require('body-parser')
var fileUpload = require('express-fileupload')
//var cookieParser = require('cookie-parser')

var auth = require('./auth')
var routes = require('./routes')
var routesUser = require('./routes/user')
var routesSettings = require('./routes/setting')
var routesBanner = require('./routes/banner')
var routesPartner = require('./routes/partner')

app.disable('x-powered-by')
app.set('view engine', 'pug')

//app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(fileUpload())
//app.use(cookieParser())

//routers
var Settings = require('./models/setting').Setting
app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname + '/index.html'))
    Settings.findOne({}, function (err, settings, next) {
        if (err) return next(err)
        res.render('frontend', {settings: settings})
    })
});

app.use('^/admin', auth)

app.get('/admin', routes.backend)
app.get('/admin/users', routesUser.list)
app.get('/admin/users/create', routesUser.createForm)
app.post('/admin/users/create', routesUser.add)
app.get('/admin/users/edit/:id', routesUser.editForm)
app.post('/admin/users/edit', routesUser.edit)
app.delete('/admin/users/delete/:id', routesUser.delete)

app.get('/admin/settings', routesSettings.form)
app.post('/admin/settings/save', routesSettings.save)

app.get('/admin/banners', routesBanner.list)
app.get('/admin/banner/create', routesBanner.createForm)
app.post('/admin/banner/create', routesBanner.add)
app.get('/admin/banner/edit/:id', routesBanner.editForm)
app.post('/admin/banner/edit', routesBanner.edit)
app.delete('/admin/banner/delete/:id', routesBanner.delete)

app.get('/admin/partners', routesPartner.list)
app.get('/admin/partner/create', routesPartner.createForm)
app.post('/admin/partner/create', routesPartner.add)
app.get('/admin/partner/edit/:id', routesPartner.editForm)
app.post('/admin/partner/edit', routesPartner.edit)
app.delete('/admin/partner/delete/:id', routesPartner.delete)

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {},
        title: 'Ошибка'
    })
})


/*app.listen(80, function () {
    console.log('Example app listening on port 80!')
})*/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})