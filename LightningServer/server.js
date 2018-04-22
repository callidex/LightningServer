var stmport = 5000;
var host = "0.0.0.0";
var net = require("net");
var dataParser = require("./parse");
var dgram = require("dgram");
var stmserver = dgram.createSocket("udp4");
var express = require('express'),
    restapiapp = express(),
    port = 8080,
    bodyParser = require('body-parser');

const mysql = require('mysql2');

var mysqlcon = mysql.createConnection({
    host: "localhost",
    user: "mapping",
    database: "lightning",
    password: "mappingpwd"
});

mysqlcon.connect();
// restapiapp is for web service on port 8080, only / (or index.ejs file at the moment) 
restapiapp.use(bodyParser.urlencoded({ extended: true }));
restapiapp.use(bodyParser.json());
restapiapp.set('view engine', 'ejs');
restapiapp.get('/', function (req, res) {

    var sql = "select * from lightning.datapackets order by received desc limit 7";
    mysqlcon.query(sql, function (err, results) {
        if (err) throw err;
        results.forEach(function (result) {
            result.data = compressdataarray(result.data);
        });
        res.render('index', { samples: results });
    });

});

restapiapp.get('/packets/:page', function (req, res, next) {
    var perPage = 30;
    var page = req.params.page || 1;

    var calc = (perPage * page) - perPage;
    var sql = "select * from lightning.datapackets d join lightning.statuspackets s on s.id = d.status_fk order by d.received desc limit " + calc + " , " + perPage;
    mysqlcon.query(sql, function (err, results) {
        if (err) throw err;
        results.forEach(function (result) {
            result.data = compressdataarray(result.data);
        });
        res.render('packets', { samples: results, current: page, pages: 1 });
    });
});

var compressdataarray = function (arr) {
    var t = [];
    for (var i = 0; i < (728 * 2); i = i + 2) {
        t.push((arr[i + 1 + 15] << 8) + arr[i + 15]);
    }
    return t;
}


restapiapp.get('/timeline', function (req, res, next) {

    var sql = "select s.gpsyear, s.gpsmonth -1 as gpsmonth, s.gpsday, s.gpshour, s.gpsmin, s.gpssec, s.detectoruid from lightning.datapackets d join lightning.statuspackets s on s.id = d.status_fk group by gpsyear, gpsmonth, gpsday, gpshour, gpsmin, gpssec, detectoruid";
    mysqlcon.query(sql, function (err, results) {
        if (err) throw err;
        var set = results.map(item => item.detectoruid).filter((value, index, self) => self.indexOf(value) === index);
        res.render('timeline', { samples: results, detectors: set });
    });
});

/*
restapiapp.get('/signal', function (req, res) {
    var sql = "select gpshour, gpsminute, gpssecond, detectoruid from lightning.datapackets";
    mysqlcon.query(sql, function(err, result) {

        rethink.db('lightning').table('datapackets').filter(rethink.row("signalcnt").gt(0)).orderBy(rethink.desc('received')).limit(1).run(conn, function(err, cursor) {
            if (err) throw err;
            console.log(cursor);
            cursor.toArray().then(function (results) {
                res.render('signal', { samples: results });
            });
        });
    });
});
*/


//setup the routes for the restapiapp
var routes = require('./api/routes/lightningRoutes');
routes(restapiapp);

restapiapp.listen(port);

console.log('REST API server started on: ' + port);

stmserver.on("listening",
    function () {
        var address = stmserver.address();
        console.log("UDP Server listening on " + address.address + ":" + address.port);
    });

stmserver.on("message",
    function (message, remote) {
        console.log(remote.address + ":" + remote.port);
        var now = Date.now();
        // forward to Bob's Boing Machine

        //  forwardToBob(message);

        var packet = {
            version: "0.4",
            type: "data",
            data: message,
            address: remote.address,
            port: remote.port,
            timestamp: now,
            processed: 0,
            received: new Date().toString()

        };
        var sql = "insert into rawpackets (address, type, data, port, processed, received, timestamp, version) VALUES ('" + packet.address + "', '" + packet.type + "',?, '" + packet.port + "', " + packet.processed + ", '" + packet.received + "'," + packet.timestamp + ",'" + packet.version + "')";
        mysqlcon.prepare(sql, function (err, statement) {
            if (err) {
                throw err;
            }
            statement.execute([packet.data], function (err, rows, columns) {
                if (err) {
                    throw err;
                }
                statement.close();
                var parsedObject = dataParser.parseDataChunk(packet, mysqlcon);
                if (parsedObject == null) {
                    console.log("Unknown object");
                } else {
                    if (parsedObject) {
                        parsedObject.persistedDate = Date.now();
                        if (parsedObject.packettype != "sample" && parsedObject.packettype != 0) {
                            storeStatusPacketInMysql(parsedObject, mysqlcon, rows.insertId);
                        }
                        else {
                            console.log("third byte", packet.data[17], "fourth ", packet.data[18], (packet.data[17] << 8) + packet.data[18]);
                            storeDataPacketInMysql(parsedObject, mysqlcon, rows.insertId);
                        }
                    }
                }

            });

        });
    });

stmserver.bind(stmport, host);

function repairendian(array) {
    var fixeddata = [];
    for (var i = 0; i < array.length; i++) {
        fixeddata.push(array[i] >> 8);
        fixeddata.push(array[i] & 0xFF);
    }
    return fixeddata;
}


var storeDataPacketInMysql = function (parsedObject, con, rawpacketid) {
    if (parsedObject.maxval < 4096) {
        if (parsedObject.data != undefined && parsedObject.signal != undefined) {
            var fixeddata = repairendian(parsedObject.data);
            var fixedsignal = repairendian(parsedObject.signal);

            var query = "INSERT INTO `datapackets` SET ?",
                values = {
                    rawpacketid: rawpacketid,
                    adcseq: parsedObject.adcseq,
                    dmatime: parsedObject.dmatime,
                    maxval: parsedObject.maxval,
                    mean: parsedObject.mean,
                    needsprocessing: 1,
                    packetnumber: parsedObject.packetnumber,
                    packettype: parsedObject.packettype,
                    received: parsedObject.received,
                    rtsecs: parsedObject.rtsecs,
                    signaldata: new Buffer(fixedsignal),
                    signalcnt: parsedObject.signalcnt,
                    stddev: parsedObject.stddev,
                    udpnumber: parsedObject.udpnumber,
                    variance: parsedObject.variance,
                    version: clean(parsedObject.version),
                    address: parsedObject.address,
                    batchid: parsedObject.batchid,
                    detectoruid: parsedObject.detectoruid,
                    data: new Buffer(fixeddata),
                };
            con.query(query, values, function (er, da) {
                if (er) throw er;
                backfilldatapacketfromstatus(con, parsedObject.batchid, parsedObject.detectoruid);
            });
        }
    }
}

var storeStatusPacketInMysql = function (parsedObject, con, rawpacketid) {
    var sql = "insert into lightning.statuspackets (rawpacketid, address, avgadcnoise, batchid, clocktrim, detectoruid, gpsday, gpsfixtype, gpsflags, gpsgspeed, gpshacc, gpshmsl, gpsheading, gpsheadingacc, gpsheight, gpshour, gpsitow, gpslat, gpslon, gpsmin, gpsmonth, gpsnano, gpsnumsv, gpspdop, gpsres1, gpsres2, gpsres3, gpssacc, gpssec, gpstacc, gpsvacc, gpsvalid, gpsveld, gpsvele, gpsveln, gpsyear, gpsuptime, majorversion, minorversion, netuptime, packetnumber, packetssent, packettype, received, sysuptime, triggernoise, triggeroffset, version)" +
        "VALUES (" + rawpacketid + ",'" + parsedObject.address + "'," + parsedObject.avgadcnoise + "," + parsedObject.batchid + "," + parsedObject.clocktrim + "," + parsedObject.detectoruid
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
        + "," + parsedObject.gps.year + "," + parsedObject.gpsuptime + "," + parsedObject.majorversion + "," + parsedObject.minorversion + "," + parsedObject.netuptime + "," + parsedObject.packetnumber + "," + parsedObject.packetssent + "," + parsedObject.packettype + "," + parsedObject.received + "," + parsedObject.sysuptime + "," + parsedObject.triggernoise + "," + parsedObject.triggeroffset + "," + parsedObject.version + ")";

    con.execute(sql, function (err, rows) {
        if (err) {
            throw err;
        }

        if (parsedObject.packettype == 1)  // end of sequence
        {
            console.log("Backfilling from batchid ", parsedObject.batchid);
            backfilldatapacketfromstatus(con, parsedObject.batchid, parsedObject.detectoruid);
        }



    });
}

function backfilldatapacketfromstatus(connection, currentbatchid, detectoruid) {

    connection.query("UPDATE  datapackets d JOIN statuspackets s ON d.batchid = s.batchid and d.detectoruid = s.detectoruid SET d.status_fk = s.id, d.needsprocessing = 0 WHERE   d.needsprocessing = 1;",
        function (err, rows) {

            if (err) throw err;

        });

    /* connection.query("SELECT id, dmatime from datapackets where needsprocessing = 1 and batchid = " + currentbatchid + " and detectoruid = " + detectoruid, function (err, rows) {
         rows.forEach(function(changed) {
             // work out actual start
             //dmatime is number of cpucycles count at end of sample
             //clocktrim is cycles per second
             var endsampletime = changed.dmatime / clocktrim;
             var endsampletimens = endsampletime * 1000000000;
             var nspersample = 373;  //1,000,000,000
             var firstsampletimestamp = endsampletimens - (728 * nspersample);
             // firstsampletimestamp = no of ns since the first second
             var sql = "update datapackets set needsprocessing = 0, status_fk = " + statusrow + ", firstsampletimestamp = " + firstsampletimestamp + ", clocktrim = " + clocktrim + ", gpshour = " + gps.hour + ",gpsmin = " + gps.min + ", gpssec = " + gps.sec + " where id = " + changed.id;
             connection.execute(sql);
 
         });
     });
 // sod it, we're back to relational databases now, do the calcs later, just marry the tables up for now
 
     */
}

/* helper functions */
var clean = function (val) {
    if (val = 'undefined') return null;
    return val;
}

var valid = function (obj) {
    return (obj != null);
}

function forwardToBob(message) {
    var client = dgram.createSocket('udp4');
    client.send(message, 0, message.length, 5001, 'gate.wzone.co.uk', (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('packet forwarded');
        }
        client.close();
    });

}
