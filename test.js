//synchro_db
var Client = require('./models/client').Client
var BuferRemote = require('./models/buferRemote').BuferRemote
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