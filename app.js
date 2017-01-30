var express = require('express')
var app = express()
var path = require('path')
var bodyParser  = require('body-parser')

var auth = require('./auth')
var routes = require('./routes')
var routesUser = require('./routes/user')
var routesSettings = require('./routes/setting')

app.disable('x-powered-by')
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

//routers
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
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

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {},
        title: 'Ошибка'
    })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})