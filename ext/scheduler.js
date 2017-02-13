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

            if( partners.click_real > 0 ){
                partner.click_real = 0
            }

            if( partners.visible === false ){
                partners.visible = true
            }

            partner.save(function (err, partner, affected) {
                //if(err) console.log(err)
            })
        }
    })
}

exports.cron2 = function(){
    console.log('I am cron2')
}