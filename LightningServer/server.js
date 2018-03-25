var port = 5000;
var host = "0.0.0.0";
var net = require("net");
var dataParser = require("./parse");
var parseddb = new Datastore({ filename: "../../parsed.db", autoload: true });


//var mysql = require('mysql');

//var con = mysql.createConnection({
//  host: "localhost",
//  user: "root",
//  database: "lightning"
//});

var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var Datastore = require("nedb"), db = new Datastore({ filename: "../../datastore.db", autoload: true });

server.on("listening",
   function () {
      var address = server.address();
      console.log("UDP Server listening on " + address.address + ":" + address.port);
   });

//con.connect(function(err)
//{if(err) throw err;
//});
server.on("message",
   function (message, remote) {
      console.log(remote.address + ":" + remote.port);
      var now = Date.now();

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
      var parsedObject = dataParser.parseDataChunk(packet.data);
      if (parsedObject == null) {
         console.log("Unknown object");
      } else {

         var persistResolvedData = function (dataObject) {
            parseddb.insert(dataObject);
         };

         if (parsedObject) {

            if (parsedObject.packettype != "undefined") {
               parsedObject.persistedDate = Date.now();
               persistResolvedData(data);
            }
         }
      }
   });

server.bind(port, host);