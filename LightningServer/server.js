
var stmport = 5000;
var host = "0.0.0.0";
var rethink = require('rethinkdb');
var net = require("net");
var dataParser = require("./parse");
var Fili = require('fili');
var dgram = require("dgram");
var stmserver = dgram.createSocket("udp4");
var express = require('express'),
    restapiapp = express(),
    port = 8080,
    bodyParser = require('body-parser');

// restapiapp is for web service on port 8080, only / (or index.ejs file at the moment) 
restapiapp.use(bodyParser.urlencoded({ extended: true }));
restapiapp.use(bodyParser.json());
restapiapp.set('view engine', 'ejs');
restapiapp.get('/', function (req, res) {
    var connection = null;
    rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
        if (err) throw err;
        connection = conn;

        rethink.db('lightning').table('datapackets').orderBy(rethink.desc('received'))

            .limit(7).run(connection, function (err, cursor) {
                if (err) throw err;
                console.log(cursor);
                cursor.toArray().then(function (results) {
                    res.render('index', { samples: results });
                });
            });
    });
});

restapiapp.get('/packets/:page', function (req, res, next) {
    var perPage = 8;
    var page = req.params.page || 1;

    var connection = null;
    rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
        if (err) throw err;
        connection = conn;

      rethink.db('lightning').table('datapackets').orderBy(rethink.desc('received')).skip((perPage * page) - perPage)
      .limit(perPage).run(connection, function (err, cursor) {
            if (err) throw err;
            cursor.toArray().then(function (results) {
               rethink.db('lightning').table('datapackets').count().run(connection, function( err, count)
               {
                  if(err) throw err;

                     var filterloop = function (a) {
                    var NZEROS = 4;
                    var NPOLES = 4;
                    var GAIN =   1.000306367;

                    var xv = new Array(NZEROS + 1);
                    var yv = new Array(NPOLES + 1);

                    xv[0] = 0;
                    xv[1] = 0;
                    xv[2] = 0;
                    xv[3] = 0;
                    xv[4] = 0;

                    yv[0] = 0;
                    yv[1] = 0;
                    yv[2] = 0;
                    yv[3] = 0;
                    yv[4] = 0;

                    var out= new Array(a.length);
                    for (var i = 0; i < a.length; i++) {
                        xv[0] = xv[1];
                        xv[1] = xv[2];
                        xv[2] = xv[3];
                        xv[3] = xv[4];

                        xv[4] = a[i] / GAIN;
                        yv[0] = yv[1];
                        yv[1] = yv[2];
                        yv[2] = yv[3];
                        yv[3] = yv[4];
                        // butterworth
                        yv[4] = (xv[0] + xv[4]) - 4 * (xv[1] + xv[3]) + 6 * xv[2] + (-0.9993875475 * yv[0]) + (3.9981624550 * yv[1]) + (-5.9981622674 * yv[2]) + (3.9993873599 * yv[3]);
                        out[i] = yv[4];

                        //cheb dude
                        yv[4] = (xv[0] + xv[4]) - 4 * (xv[1] + xv[3]) + 6 * xv[2] + ( -0.9999208428 * yv[0]) + (  3.9997620899 * yv[1])  + ( -5.9997616515 * yv[2]) + (  3.9999204043 * yv[3]);


                    }
                    return out;
                }

                 var CUTOFF = 100;
                 var SAMPLE_RATE = 2680000;
                 var  RC = 1.0/(CUTOFF*2*3.14);
                 var dt = 1.0/SAMPLE_RATE;
                 var alpha = RC/(RC + dt);

                 var filters = [];

                  console.log(results.length);
                 for(var x=0; x < results.length;x++)
                 {
//                     filters[x] = filterloop(results[x].data);
                  
                    console.log("in the loop");    
                    var arr  = [];
                    
                    arr.push(0);
                    console.log(results[x].data.length, x);
                    for(var i=1;i< results[x].data.length; i++)
                    {                    
                       var t = alpha * (  arr[i-1] * results[x].data[i] - results[x].data[i-1]) ;
                       arr.push(t);                       
                       console.log("pushed", t);
                    }

                   filters.push(filterloop(results[x].data));
                 }
                  
                 res.render('packets', { samples: results, current: page, pages: count/perPage, filter: filters });
               });
            });
         });
   });
});


var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

restapiapp.get('/timeline', function (req, res, next) {


    var connection = null;

    rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
        if (err) throw err;
        connection = conn;

        rethink.db('lightning').table('datapackets').hasFields('gps').pluck('gps', 'detectoruid').run(connection, function (err, cursor) {
            if (err) throw err;
            cursor.toArray().then(function (results) {

                var set = results.map(item => item.detectoruid).filter((value, index, self) => self.indexOf(value) === index);


                res.render('timeline', { samples: results, detectors: set });
            });  // 
        });  // db

    });// connect



});

restapiapp.get('/signal', function (req, res) {
    var connection = null;
    rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
        if (err) throw err;
        rethink.db('lightning').table('datapackets').filter(rethink.row("signalcnt").gt(0)).orderBy(rethink.desc('received')).limit(1).run(conn, function (err, cursor) {
            if (err) throw err;
            console.log(cursor);
            cursor.toArray().then(function (results) {
                res.render('signal', { samples: results });
            });
        });
    });
});

restapiapp.get('/filter', function (req, res) {
    var connection = null;
    rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
        if (err) throw err;
        rethink.db('lightning').table('datapackets').filter(rethink.row("signalcnt").gt(0)).orderBy(rethink.desc('received')).limit(1).run(conn, function (err, cursor) {
            if (err) throw err;
            console.log(cursor);
            cursor.toArray().then(function (results) {

                var iirCalculator = new Fili.CalcCascades();
                var iirFilterCoeffs = iirCalculator.highpass({
                    order: 1, // cascade 3 biquad filters (max: 12)
                    characteristic: 'butterworth',
                    Fs: 2680000, // sampling frequency
                    Fc: 100, // cutoff frequency / center frequency for bandpass, bandstop, peak
                    gain: 0, // gain for peak, lowshelf and highshelf
                    preGain: false // adds one constant multiplication for highpass and lowpass
                    // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
                });

                // pauls dodgy filter

                var filterloop = function (a) {
                    var NZEROS = 4;
                    var NPOLES = 4;
                    var GAIN = 0.8;//             1.000306367e+00;

                    var xv = new Array(NZEROS + 1);
                    var yv = new Array(NPOLES + 1);

                    xv[0] = 0;
                    xv[1] = 0;
                    xv[2] = 0;
                    xv[3] = 0;
                    xv[4] = 0;

                    yv[0] = 0;
                    yv[1] = 0;
                    yv[2] = 0;
                    yv[3] = 0;
                    yv[4] = 0;

                    var out= new Array(a.length);
                    for (var i = 0; i < a.length; i++) {
                        xv[0] = xv[1];
                        xv[1] = xv[2];
                        xv[2] = xv[3];
                        xv[3] = xv[4];

                        xv[4] = a[i] / GAIN;
                        yv[0] = yv[1];
                        yv[1] = yv[2];
                        yv[2] = yv[3];
                        yv[3] = yv[4];
                        yv[4] = (xv[0] + xv[4]) - 4 * (xv[1] + xv[3]) + 6 * xv[2] + (-0.9993875475 * yv[0]) + (3.9981624550 * yv[1]) + (-5.9981622674 * yv[2]) + (3.9993873599 * yv[3]);
                        out[i] = yv[4];

                    }
                    return out;
                }
                var filter = filterloop(results[0].data);
                res.render('filter', { samples: results, filter: filter });

            });
        });
    });
});


//setup the routes for the restapiapp
//var routes = require('./api/routes/lightningRoutes');
//routes(restapiapp);

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


        rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
            if (err) throw err;

            rethink.db('lightning').table('rawpackets').insert(packet).run(conn, function (err, res) {
                if (err) throw err;

                console.log("parsing object at " + packet.received);
                var parsedObject = dataParser.parseDataChunk(packet, conn);
                if (parsedObject == null) {
                    console.log("Unknown object");
                } else {

                    if (parsedObject) {
                        parsedObject.persistedDate = Date.now();
                        if (parsedObject.packettype != "sample" && parsedObject.packettype != 0) {

                            rethink.db('lightning').table('statuspackets').insert(parsedObject).run(conn, function (err, res) { if (err) throw err; });
                        }
                        else {
                            if (parsedObject.maxval < 4096)
                                rethink.db('lightning').table('datapackets').insert(parsedObject).run(conn, function (err, res) { if (err) throw err; });
                        }
                    }
                }
            });
        });
    });

stmserver.bind(stmport, host);
