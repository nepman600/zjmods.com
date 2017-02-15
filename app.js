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
var routesClient = require('./routes/client')

app.disable('x-powered-by')
app.set('view engine', 'pug')

//app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(fileUpload())
//app.use(cookieParser())

//routers
app.get('/', routes.frontend)
app.get('/en', routes.frontendEn)
app.get('/extend', routes.extend)
//app.get('/client', routes.client)
app.post('/client', routes.client)

app.get('/assembly', function(req, res) {
    var file = __dirname + '/public/docs/assembly.docx'
    var filename = path.basename(file)
    res.setHeader('Content-disposition', 'attachment; filename=' + filename)
    res.download(file)
})

app.get('/function_keys', function(req, res) {
    /*var file = __dirname + '/public/docs/assembly.docx'
    var filename = path.basename(file)
    res.setHeader('Content-disposition', 'attachment; filename=' + filename)
    res.download(file)*/
})

app.get('/intro', routesSettings.intro)

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
app.post('/partner/click/:id', routesPartner.click)

app.get('/admin/clients', routesClient.list)
app.get('/admin/clients/create', routesClient.createForm)
app.post('/admin/clients/create', routesClient.add)
app.get('/admin/clients/edit/:id', routesClient.editForm)
app.post('/admin/clients/edit', routesClient.edit)
app.delete('/admin/client/delete/:id', routesClient.delete)
app.get('/admin/client/search/:id', routesClient.search)

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {},
        title: 'Ошибка'
    })
})


/*app.listen(80, function () {
    //console.log('Example app listening on port 80!')
})*/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

//cron
var scheduler = require('./ext/scheduler')
var CronJob = require('cron').CronJob

new CronJob('00 00 00 * * *', function() {
//new CronJob('* * * * * *', function() {
    scheduler.zeroClick()
}, null, true, 'Europe/Moscow')

/*
new CronJob('* * * * * *', function() {
    scheduler.cron2()
}, null, true, 'Europe/Moscow')*/
