var crypto = require('crypto')
var async = require('async')
var request = require('request')
//var Settings = require('../models/setting').Setting
var Payment = require('../models/payment').Payment
var e = require('../ext/error')

exports.list = function (req, res, next) {
    //console.log('Cookies: ', req.cookies)
    Payment.find({}, function (err, payments) {
        if (err) next(err)

        //res.json(users)
        var data = []
        for(var i = 0; i < payments.length; i++){
            //data[i] = {id: payments[i]._id, gameID: payments[i].gameID, expire: payments[i].date}
            data[i] = {num: i+1, gameID: payments[i].gameID, expire: payments[i].date}
        }
        //console.log(data)
        res.render('payment/index', {data: data})
    })
}

exports.add = function (req, res, next) {
    var ID = parseInt(req.body.cid) * parseInt(req.body.token) + parseInt(req.body.stok)

    async.series([
        getUserData,
        addData
    ], function (err, results) {
        // Here, results is an array of the value from each function
        //console.log(results);
        if(err)
            res.send(err)
        else
            res.send('success!')
    });

    function getUserData(callback) {
        request.post(
            'https://api.worldoftanks.ru/wot/account/info/?application_id=demo&account_id=' + ID,
            //{ json: { key: 'value' } },
            function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    //console.dir(JSON.parse(body).data['202236'].nickname)
                    callback(null, JSON.parse(body).data[ID].nickname)
                }
                else {
                    callback(err)
                }
            }
        )
    }

    function addData(nickname, callback) {
        if (typeof req.body.q != 'undefined')
        {
            if( crypto.createHash('md5').update(req.body.cid + req.body.date + String(ID)).digest("hex") == req.body.q )
            {
                var arDate = req.body.date.split('.')
                //console.log(new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]))

                Payment.findOne({gameID:ID}, function (err, client) {
                    if(err) {
                        callback(err)
                        //res.send(err)
                    }
                    else if(client === null) {
                        var payment = new Payment({
                            gameID: ID,
                            date: new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]),
                            region: req.body.reg,
                            nickname: nickname
                        })

                        payment.save(function (err, payment, affected) {
                            if(err){
                                //res.send(err)
                                callback(err)
                            }
                            else {
                                callback('success!')
                                //res.send('success!')
                                //res.json(payment)
                            }
                        })
                    }
                    else {
                        client.last_visit = new Date(Date.now())
                        client.count = client.count +1
                        client.save(function (err, updatedRecord, affected) {
                            if(err){
                                //res.send(err)
                                callback(err)
                            }
                            else {
                                callback('success!')
                                //res.send('success!')
                                //res.json(updatedRecord)
                            }
                        })
                    }
                })
            }
            else {
                callback('success!')
                //res.send('success!')
            }
        }
        else
        {
            var arDate = req.body.date.split('.')
            //console.log(new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]))

            Payment.findOne({gameID:ID}, function (err, client) {
                //if (err) return next(err)
                if(err) {
                    //res.send(err)
                    callback(err)
                }
                else if(client === null) {
                    var payment = new Payment({
                        gameID: ID,
                        date: new Date(arDate[2]+'.'+arDate[1]+'.'+arDate[0]),
                        region: req.body.reg,
                        nickname: nickname
                    })

                    payment.save(function (err, payment, affected) {
                        if(err){
                            //res.send(err)
                            callback(err)
                        }
                        else {
                            callback('success!')
                            //res.send('success!')
                            //res.json(payment)
                        }
                    })
                }
                else {
                    client.last_visit = new Date(Date.now())
                    client.count = client.count +1
                    client.save(function (err, updatedRecord, affected) {
                        if(err){
                            //res.send(err)
                            callback(err)
                        }
                        else {
                            callback('success!')
                            //res.send('success!')
                            //res.json(updatedRecord)
                        }
                    })
                }
            })
        }
    }
}

exports.csv = function (req, res, next) {
    var json2csv = require('json2csv');
    var fs = require('fs');
    var fields = ['gameID', 'date'];

    Payment.find({}, function (err, payments) {
        if (err) next(err)

        var csv = json2csv({ data: payments, fields: fields });

        fs.writeFile('file.csv', csv, function(err) {
            if (err) throw err;
                console.log('file saved');
        });

        //console.log(data)
        res.render('payment/index', {data: data})
    })
}
