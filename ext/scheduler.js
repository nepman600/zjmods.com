var Partner = require('../models/partner').Partner
var Settings = require('../models/setting').Setting

exports.zeroClick = function(){
    //console.log('You will see this message every second')
    Partner.find({}, function (err, partners) {
        //if (err) return next(err)
        if (err) return

        //res.json(partners)
        //console.log(partners)
        for(var i = 0; i < partners.length; i++){
            var partner = partners[i]

            if( partner.click_real > 0 ){
                partner.click_real = 0
            }

            if( partner.visible === false ){
                partner.visible = true
            }

            partner.save(function (err, partner, affected) {
                if(err) console.log(err)
            })
        }
    })
}

exports.cron2 = function(){
    console.log('I am cron2')
}

//synchro_db
var Client = require('../models/client').Client
var BuferRemote = require('../models/buferRemote').BuferRemote

exports.synchro_db_add = function() {
    //console.log('synchro_db_add')
    BuferRemote.find({}, function (err, clients) {
        //if(err) console.error(err)
        if (!err && clients != null) {
            var dataAdd = []
            for(var i = 0; i < clients.length; i++) {
                var bufer = clients[i]._doc
                var ID = bufer.data.id.replace('"', '').replace('"', '')
                if(bufer.act == 'add') {
                    dataAdd.push({
                        _id: ID,
                        hash: bufer.data.hash,
                        expire: bufer.data.expire,
                        //expire: new Date(+new Date() + 1*24*60*60*1000),
                        ban: bufer.data.ban
                    })
                 }
            }

            dataAdd.forEach(function(item, i, dataAdd) {
                var client = new Client({
                    _id: item._id,
                    hash: item.hash,
                    expire: item.expire,
                    //expire: new Date(+new Date() + 1*24*60*60*1000),
                    ban: item.ban
                })
                client.save(function (err, client, affected) {})
            })
        }
    })
}

exports.synchro_db_edit = function() {
    //console.log('synchro_db_edit')
    BuferRemote.find({}, function (err, clients) {
        //if(err) console.error(err)
        if (!err && clients != null) {
            var dataEdit = []

            for(var i = 0; i < clients.length; i++) {
                var bufer = clients[i]._doc
                var ID = bufer.data.id.replace('"', '').replace('"', '')
                if(bufer.act == 'edit') {
                    dataEdit.push({
                        _id: ID,
                        hash: bufer.data.hash,
                        expire: bufer.data.expire,
                        //expire: new Date(+new Date() + 1*24*60*60*1000),
                        ban: bufer.data.ban
                    })
                }
            }

            dataEdit.forEach(function(item, i, dataEdit) {
                var ObjectId = require('mongoose').Types.ObjectId
                var query = { _id: new ObjectId(item._id) }
                Client.findById(query, function (err, client) {
                    if(!err && client != null) {
                        client.hash = item.hash
                        client.expire = item.expire
                        client.ban = item.ban
                        client.save(function (err, updatedClient) {})
                    }
                })
            })
        }
    })
}

exports.synchro_db_del = function() {
    //console.log('synchro_db_del')
    BuferRemote.find({}, function (err, clients) {
        //if(err) console.error(err)
        if (!err && clients != null) {
            var dataDel = []

            for(var i = 0; i < clients.length; i++) {
                var bufer = clients[i]._doc
                var ID = bufer.data.id.replace('"', '').replace('"', '')
                if(bufer.act == 'del') {
                    dataDel.push({_id: ID})
                }
            }

            dataDel.forEach(function(item, i, dataEdit) {
                Client.findByIdAndRemove(item._id, function (err, client) {})
            })
        }

        BuferRemote.remove({}, function () {})
    })
}

