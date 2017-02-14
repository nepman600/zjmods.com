var Client = require('../models/client').Client
var e = require('../ext/error')

exports.list = function (req, res, next) {
    //console.log('Cookies: ', req.cookies)
    Client.find({}, function (err, clients) {
        if (err) next(err)

        //res.json(users)
        var data = []
        for(var i = 0; i < clients.length; i++){
            data[i] = {id: clients[i]._id, hash: clients[i].hash, expire: clients[i].expire, ban: clients[i].ban}
        }
        //console.log(data)
        res.render('clients/index', {data: data})
    })
}


exports.createForm = function (req, res) {
    res.render('users/create')
}

exports.add = function (req, res) {
    var user = new User({
        username: req.body.username,
        pass: req.body.password
    })
    user.save(function (err, user, affected) {
        //if(err) throw err
        if(err){
            //console.log(req.body)
            res.render('users/create', {err: 'Ошибка!!!'})
        }
        else res.redirect('/admin/users')
    })
}

exports.editForm = function (req, res, next) {
    Client.findById(req.params.id, function (err, client) {
        /*if (err) return console.error(err)
        res.render('users/edit', {user: user})*/
        if (err) return next(err)
        if(client === null) return next(e.setError(404, 'Client not found!'))
        res.render('clients/edit', {client: client})
    })
}

exports.edit = function (req, res, next) {
    Client.findById(req.body.clientID, function (err, client) {
        if (err) return next(err)
        if(client === null) return next(e.setError(404, 'Client not found!'))

        client.hash = req.body.hash
        client.expire = req.body.expire
        client.ban = (req.body.ban == 'false') ? false : true
        client.save(function (err, updatedClient) {
            if(err) return res.render('client/edit', {err: 'Ошибка!!!'})
            //if (err) return next(err)
            res.redirect('/admin/clients')
        })
    })
}

exports.delete = function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) return next(err)
        if(user === null) return next(e.setError(404, 'User not found!'))

        //res.json(user)
        User.findByIdAndRemove(req.params.id, function (err, user) {
            var response = {
                message: "User successfully deleted",
                id: user._id
            };
            res.send(response);
        });
    })
}