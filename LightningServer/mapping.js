'use strict';
var Datastore = require("nedb");
var parser = require("./parse");
var rethink = require('rethinkdb');

function sleep(time) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
}

rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
    if (err) throw err;
    conn.use('lightning');

    rethink.table('rawpackets').filter({ 'processed': 0 }).
        orderBy('received').limit(4000).run(conn, function (err, cursor) {
            if (err) throw err;
            cursor.toArray().then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log('parsing object ', i);
                    var parsedObject = parser.parseDataChunk(results[i], conn);

                    if (parsedObject.batchid > 0) {
                        if (parsedObject.detectoruid != 74567) {
                            if (parsedObject == null) {
                                console.log("Unknown object");
                            }
                            else {

                                if (parsedObject) {
                                    parsedObject.persistedDate = Date.now();
                                    if (parsedObject.packettype != "sample" && parsedObject.packettype != 0) {

                                        rethink.db('lightning').table('statuspackets').insert(parsedObject).run(conn, { durability: 'hard' }, function (err, res) {
                                            if (err) throw err;

                                            console.log('written status packet ', res);
                                        });
                                    }
                                    else {
                                        if (parsedObject.maxval < 4096) {
                                            rethink.db('lightning').table('datapackets').insert(parsedObject).run(conn, { durability: 'hard' }, function (err, res) {
                                                if (err) throw err;
                                                console.log('written data packet', res);

                                            });
                                        }
                                        else {
                                            console.log('crap packet');
                                        }
                                    }
                                }
                            }
                        }
                    }
                    rethink.table('rawpackets').get(results[i].id).update({ processed: 1 }).run(conn);
                }
            });
        });
});
