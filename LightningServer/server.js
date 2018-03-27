var port = 5000;
var host = "0.0.0.0";
var net = require("net");
var dataParser = require("./parse");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var Datastore = require("nedb"), db = new Datastore({ filename: "../../datastore.db", autoload: true });
var parseddb = new Datastore({ filename: "../../parsed.db", autoload: true });

var express = require('express'), 
    app = express(), 
    port = process.env.PORT || 5001,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true } ));
app.use(bodyParser.json());

var routes = require('./api/routes/lightningRoutes');
routes(app);

app.listen(port);

console.log('REST API server started on: ' + port);

server.on("listening",
   function () {
      var address = server.address();
      console.log("UDP Server listening on " + address.address + ":" + address.port);
   });

server.on("message",
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

server.bind(port, host);
