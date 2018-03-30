'use strict';
var r = require('rethinkdb');

exports.list_all_packets = function(req, res) 
{

    var connection = null;
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        if (err) throw err;
        connection = conn;
console.log(connection);
console.log('list packets');

        r.db('lightning').table('rawpackets').orderBy(r.desc('received')).limit(1).run(connection, function(err, cursor) {
            if (err) throw err;

console.log(cursor);
                cursor.toArray().then(function(results) {


                res.json(results);
                
                });
        });

        });
    }


                                            