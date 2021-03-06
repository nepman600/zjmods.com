var backup = require('mongodb-backup')

backup({
    //uri: 'uri', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
    uri: 'mongodb://localhost/db1',
    root: __dirname, // write files into this dir
    callback: function(err) {

        if (err) {
            console.error(err)
        } else {
            console.log('finish')
        }
    }
})

//export to csv
//mongoexport --db=db1 --collection=payments --type csv --fields gameID,date --out /home/web/www/payment.csv
