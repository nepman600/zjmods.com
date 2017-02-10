var User = require('../models/user').User
var e = require('../ext/error')

exports.list = function (req, res) {
    //console.log('Cookies: ', req.cookies)
    User.find({}, function (err, users) {
        if (err)
            return console.error(err)

        //res.json(users)
        var data = []
        for(var i = 0; i < users.length; i++){
            data[i] = {id: users[i]._id, username: users[i].username, created: users[i].created}
        }
        //console.log(data)
        res.render('users/index', {data: data})
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
    User.findById(req.params.id, function (err, user) {
        /*if (err) return console.error(err)
        res.render('users/edit', {user: user})*/
        if (err) return next(err)
        if(user === null) return next(e.setError(404, 'User not found!'))
        res.render('users/edit', {user: user})
    })
}

exports.edit = function (req, res, next) {
    User.findById(req.body.userID, function (err, user) {
        if (err) return next(err)
        if(user === null) return next(e.setError(404, 'User not found!'))

        user.username = req.body.username
        user.pass = req.body.password
        user.save(function (err, updatedUser) {
            //if(err) return res.render('users/create', {err: 'Ошибка!!!'})
            if (err) return next(err)
            res.redirect('/admin/users')
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