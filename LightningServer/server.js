var stmport = 5000;
var stmportalt = 5001;
var host = "0.0.0.0";
var rethink = require('rethinkdb');    
var net = require("net");
var dataParser = require("./parse");
var dgram = require("dgram");
var stmserver = dgram.createSocket("udp4");
var stmserveralt = dgram.createSocket("udp4");
var Datastore = require("nedb"), db = new Datastore({ filename: "../../datastore.db", autoload: true });
var parseddb = new Datastore({ filename: "../../parsed.db", autoload: true });

var express = require('express'), 
    restapiapp = express(), 
    port = 8080,
    bodyParser = require('body-parser');

restapiapp.use(bodyParser.urlencoded({ extended: true } ));
restapiapp.use(bodyParser.json());

restapiapp.set('view engine', 'ejs');
restapiapp.get('/', function (req, res) {

   var parsed = new Datastore({ filename: "../../parsed.db", autoload: true });

   parsed.find({}).sort({ timestamp: -1 }).limit(1000).exec(function (err, docs) {
      res.render('index', { samples: docs }); 
   })

})




var routes = require('./api/routes/lightningRoutes');
routes(restapiapp);

restapiapp.listen(port);

console.log('REST API server started on: ' + port);

stmserver.on("listening",
   function () {
      var address = stmserver.address();
      console.log("UDP Server listening on " + address.address + ":" + address.port);
   });

stmserveralt.on("message",
   function (message, remote) {
      console.log("Incoming message on wrong port, 5001");
      console.log("redirecting");
      var redir = dgram.createSocket('udp4');
      redir.send(message, 0, message.length, 5000, 'localhost', (err) => {
      if(err) throw err;
      });
      });
stmserver.on("message",
   function (message, remote) {
      console.log(remote.address + ":" + remote.port);
     var now = Date.now();

     var client = dgram.createSocket('udp4');
     client.send(message, 0, message.length, 5001, 'gate.wzone.co.uk', (err) => {

         if(err)
         { 
            console.log(err);
         }
         else 
         { 
            console.log('packet forwarded'); 
         }
         
         client.close();
      });

      var packet = {
         version: "0.2",
         type: "data",
         data: message,
         address: remote.address,
         port: remote.port,
         timestamp: now,
         received: new Date().toString()
      };

      db.insert(packet,
         function (err, newDoc) {
            if (err) throw err;
            console.log("packet stored");
            



  rethink.connect({ host: 'localhost', port: 28015 }, function(err, conn) 
   {
   if(err) throw err;
   
      rethink.db('lightning').table('rawpackets').insert(packet).run(conn, function(err, res)
                  {
                  if(err) throw err;
                   console.log(res);
                  });//
   });



              console.log("parsing object at " + packet.received);
      var parsedObject = dataParser.parseDataChunk(packet);
      if (parsedObject == null) {
         console.log("Unknown object");
      } else {

         var persistResolvedData = function (dataObject) {
            parseddb.insert(dataObject);
         };

         if (parsedObject) {

            if (parsedObject.packettype != "undefined") {
               parsedObject.persistedDate = Date.now();
               persistResolvedData(parsedObject);
            }
         }
      }
      });
   });

stmserver.bind(stmport, host);
stmserveralt.bind(stmportalt, host);