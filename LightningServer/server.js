
var stmport = 5000;
var host = "0.0.0.0";
var rethink = require('rethinkdb');
var net = require("net");
var dataParser = require("./parse");
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

restapiapp.get('/packets/:page', function(req, res, next)
{
  var perPage = 8;
  var page = req.params.page || 1;
  
   var connection = null;
   rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
      if (err) throw err;
      connection = conn;

      rethink.db('lightning').table('datapackets').orderBy(rethink.desc('received')).skip((perPage * page) - perPage)
      .limit(perPage).run(connection, function (err, cursor) {
            if (err) throw err;
            console.log(cursor);
            cursor.toArray().then(function (results) {
               rethink.db('lightning').table('datapackets').count().run(connection, function( err, count)
               {
                  if(err) throw err;
                  
                    res.render('packets', { samples: results, current: page, pages: count/perPage });
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

restapiapp.get('/timeline', function(req, res, next)
{


   var connection = null;

   rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
      if (err) throw err;
      connection = conn;

      rethink.db('lightning').table('datapackets').hasFields('gps').pluck('gps','detectoruid').run(connection, function (err, cursor) {
            if (err) throw err;
          cursor.toArray().then(function (results) {

var set =results.map(item => item.detectoruid).filter((value, index, self) => self.indexOf(value) === index);


              res.render('timeline', { samples: results, detectors: set });
               });  // 
      });  // db
      
   });// connect



});

restapiapp.get('/signal', function (req, res) {
   var connection = null;
   rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
      if (err) throw err;
      rethink.db('lightning').table('datapackets').filter(rethink.row("signalcnt").gt(0)). orderBy(rethink.desc('received')).limit(1).run(conn, function (err, cursor) {
         if (err) throw err;
         console.log(cursor);
         cursor.toArray().then(function (results) {
               res.render('signal', { samples: results });
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
         processed = 0,
         received: new Date().toString()
         
      };


      rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
         if (err) throw err;

         rethink.db('lightning').table('rawpackets').insert(packet).run(conn, function (err, res) {
            if (err) throw err;

            console.log("parsing object at " + packet.received);
            var parsedObject = dataParser.parseDataChunk(packet,conn);
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
