/*var express = require('express');
var router = express.Router();

/!* GET home page. *!/
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;*/

/*var data = {
    page: 'Main page',
    content: 'Some content'
}*/

exports.frontend = function (req, res) {
    res.render('frontend.pug', data)
}

exports.backend = function (req, res) {
    res.render('backend.pug', {page: 'Админка'})
}