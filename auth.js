var basicAuth = require('basic-auth')
var User = require('./models/user').User
var crypto = require('crypto')
//var e = require('./ext/error')

var auth = function (req, res, next) {
    //console.log(req)
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401)
    };

    var user = basicAuth(req);

    // Если пользователь не ввёл пароль или логин, снова показать форму.
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    User.findOne(
        {username: user.name},  // query
        function (err, curUser)
        {
            if (err) return next(err)

            if (curUser)
            {
                var pass = user.pass

                var encryptPass = function (pass) {
                    return crypto.createHmac('sha1', curUser.salt).update(pass).digest('hex')
                }

                if ( encryptPass(pass) == curUser.hash ) {
                    return next()
                } else {
                    return unauthorized(res)
                }
            }
            else
                return unauthorized(res)

            return unauthorized(res)
        }
    )


    // Если логин admin, а пароль '123456' перейти к следующему middleware.
    /*if (user.name === 'admin' && user.pass === '123456') {
        return next();
    } else {
        return unauthorized(res);
    }*/

    //return unauthorized(res);
};

module.exports = auth