'use strict';
var parser = require("./parse");

function sleep(time) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
}

const mysql = require('mysql2');

var con = mysql.createConnection({
    host: "s7.slashdit.com",
    database: "lightning",
    user: "mapping",
    password: "mappingpwd"
});

con.connect(function (err) {

    if (err) throw err;
    console.log("Connected!");

    con.query("select * from rawpackets order by received LIMIT 100",
        function (err, rows) {

            if (err) {
                console.log("mapping error");
                throw err;
            }
            for (var i = 0; i < rows.length; i++) {
                console.log('parsing object ', i);
                var newobject = parser.parseDataChunk(rows[i], con);
                if (valid(newobject)) {
                    newobject.persistedDate = Date.now();
                    if (newobject.packettype != "sample" && newobject.packettype != 0) {
                        storeStatusPacketInMysql(newobject, con, rows[i].id);
                    }
                    else {
                        storeDataPacketInMysql(newobject,con, rows[i].id);
                    }
                }
            }
        });
});


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

    connection.query("select id from datapackets d WHERE d.needsprocessing = 1 and d.detectoruid = " + detectoruid + " and d.batchid = " + currentbatchid,
        function (err, datapacketsrows) {

            if (err) {
                console.log("Error in backtrace");
                throw err;
            }

            connection.query("select id from statuspackets d WHERE d.detectoruid = " + detectoruid + " and d.batchid = " + currentbatchid + " order by received desc LIMIT 1",
                function (err, statuspacketrows) {

                    if (err) {
                        console.log("Error in 2nd level");
                        throw err;
                    }
                    // 1 status, multiple data packets    
                    var dataids = [];
                    for (var i = 0; i < datapacketsrows.length; i++)
                    {
                        dataids.push(datapacketsrows[i].id);
                    }
                    var sql = "update datapackets set needsprocessing = 1,  status_fk = " + statuspacketrows[0].id + " where id in (" + dataids.join() + ");";
                    connection.query(sql);
                });

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
function repairendian(array) {
    var fixeddata = [];
    for (var i = 0; i < array.length; i++) {
        fixeddata.push(array[i] >> 8);
        fixeddata.push(array[i] & 0xFF);
    }
    return fixeddata;
}


