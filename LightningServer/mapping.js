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

const mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "mapping",
    password: "mappingpwd"
});

con.connect(function (err) {

    if (err) throw err;
    console.log("Connected!");

    con.execute("delete from lightning.datapackets");
    con.execute("delete from lightning.statuspackets");

    rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
        if (err) throw err;
        conn.use('lightning');
        rethink.table('rawpackets')
            .run(conn, function (err, cursor) {
                if (err) throw err;
                cursor.toArray().then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        console.log('parsing object ', i);
                        var newobject = parser.parseDataChunk(results[i], conn);
                        if (valid(newobject)) {
                            newobject.persistedDate = Date.now();
                            if (newobject.packettype != "sample" && newobject.packettype != 0) {
                                storeStatusPacketInMysql(newobject);
                            }
                            else {
                                storeDataPacketInMysql(newobject);
                            }
                        }
                    }
                });
            });
    });
});

/* helper functions */
var clean = function (val) {
    if (val = 'undefined') return null;
    return val;
}

var valid = function (obj)
{
    return (obj != null);
}


var storeDataPacketInMysql = function(parsedObject) {
    if (parsedObject.maxval < 4096) {

        var sql = "INSERT INTO lightning.datapackets(adcseq, address, batchid /*, clocktrim */, data, detectoruid, dmatime/*, firstsampletimestamp, status_fk, rawpacketid*/, maxval, mean, needsprocessing, packetnumber, packettype, persisteddate, received, rtsecs, signaldata, signalcnt, stddev, udpnumber, variance, version ) VALUES (" + parsedObject.adcseq + ",'" + parsedObject.address + "'," + parsedObject.batchid + ",?," + parsedObject.detectoruid + "," + parsedObject.dmatime + "," + parsedObject.maxval + "," + parsedObject.mean + "," + parsedObject.needsprocessing + "," + parsedObject.packetnumber + "," + parsedObject.packettype + "," + clean(parsedObject.persisteddate) + "," + parsedObject.received + "," + parsedObject.rtsecs + ",?," + parsedObject.signalcnt + "," + parsedObject.stddev + "," + parsedObject.udpnumber + "," + parsedObject.variance + "," + clean(parsedObject.version) + ")";
        con.prepare(sql, function(err, statement) {
            if (err) {
                throw err;
            }
            // statement.parameters - array of column definitions, length === number of params, here 2
            // statement.columns - array of result column definitions. Can be empty if result schema is dynamic / not known
            // statement.id
            // statement.query

            if (parsedObject.data == undefined || parsedObject.signal == undefined) {
                // no valid data, 
                console.log("skipping invalid data / signal");

            }
            else {
                statement.execute([parsedObject.data, parsedObject.signal], function(err, rows, columns) {
                    if (err) {
                        throw err;
                    }
                    console.log("inserted!!!");
                });
            }
            // note that there is no callback here. There is no statement close ack at protocol level.
            statement.close();

        });

    }
}
var storeStatusPacketInMysql = function(parsedObject) {


    var sql = "insert into lightning.statuspackets (address, avgadcnoise, batchid, clocktrim, detectoruid, gpsday, gpsfixtype, gpsflags, gpsgspeed, gpshacc, gpshmsl, gpsheading, gpsheadingacc, gpsheight, gpshour, gpsitow, gpslat, gpslon, gpsmin, gpsmonth, gpsnano, gpsnumsv, gpspdop, gpsres1, gpsres2, gpsres3, gpssacc, gpssec, gpstacc, gpsvacc, gpsvalid, gpsveld, gpsvele, gpsveln, gpsyear, gpsuptime, majorversion, minorversion, netuptime, packetnumber, packetssent, packettype, persisteddate, received, sysuptime, triggernoise, triggeroffset, version)" +
        "VALUES ('" + parsedObject.address + "'," + parsedObject.avgadcnoise + "," + parsedObject.batchid + "," + parsedObject.clocktrim + "," + parsedObject.detectoruid
        + "," + parsedObject.gps.day
        + "," + parsedObject.gps.fixType
        + "," + parsedObject.gps.flags
        + "," + parsedObject.gps.gSpeed
        + "," + parsedObject.gps.hAcc
        + "," + parsedObject.gps.hMSL
        + "," + parsedObject.gps.heading
        + "," + parsedObject.gps.headingAcc
        + "," + parsedObject.gps.height
        + "," + parsedObject.gps.hour
        + "," + parsedObject.gps.iTOW
        + "," + parsedObject.gps.lat
        + "," + parsedObject.gps.lon
        + "," + parsedObject.gps.min
        + "," + parsedObject.gps.month
        + "," + parsedObject.gps.nano
        + "," + parsedObject.gps.numSV
        + "," + parsedObject.gps.pDOP
        + "," + parsedObject.gps.reserved1
        + "," + parsedObject.gps.reserved2
        + "," + parsedObject.gps.reserved3
        + "," + parsedObject.gps.sAcc
        + "," + parsedObject.gps.sec
        + "," + parsedObject.gps.tAcc
        + "," + parsedObject.gps.vAcc
        + "," + parsedObject.gps.valid
        + "," + parsedObject.gps.velD
        + "," + parsedObject.gps.velE
        + "," + parsedObject.gps.velN
        + "," + parsedObject.gps.year + "," + parsedObject.gpsuptime + "," + parsedObject.majorversion + "," + parsedObject.minorversion + "," + parsedObject.netuptime + "," + parsedObject.packetnumber + "," + parsedObject.packetssent + "," + parsedObject.packettype + "," + clean(parsedObject.persisteddate) + "," + parsedObject.received + "," + parsedObject.sysuptime + "," + parsedObject.triggernoise + "," + parsedObject.triggeroffset + "," + parsedObject.version + ")";

    con.execute(sql, function(err, statement) {
        if (err) {
            throw err;
        }
        console.log('status inserted');
    });
}