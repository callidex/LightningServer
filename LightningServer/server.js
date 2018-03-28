var stmport = 5000;
var host = "0.0.0.0";
var net = require("net");
var dataParser = require("./parse");
var dgram = require("dgram");
var stmserver = dgram.createSocket("udp4");
var Datastore = require("nedb"), db = new Datastore({ filename: "../../datastore.db", autoload: true });
var parseddb = new Datastore({ filename: "../../parsed.db", autoload: true });

var express = require('express'), 
    restapiapp = express(), 
    port = 5001,
    bodyParser = require('body-parser');

restapiapp.use(bodyParser.urlencoded({ extended: true } ));
restapiapp.use(bodyParser.json());

restapiapp.set('view engine', 'ejs');
restapiapp.get('/', function (req, res) {
  res.render('index');
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

stmserver.bind(stmport, host);
