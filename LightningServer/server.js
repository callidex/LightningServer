var PORT = 5000;
var HOST = '0.0.0.0';

var net = require('net');
var dataParser = require('./parse');
var web = net.createServer(function (socket) {
   socket.write('Echo server\r\n');
   socket.pipe(socket);
});
//var mysql = require('mysql');

//var con = mysql.createConnection({
//  host: "localhost",
// user: "root",
//  password: "bdars",
//  database: "lightning"
//});

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var Datastore = require('nedb'), db = new Datastore({ filename: 'datastore.db', autoload: true })

server.on('listening', function () {
   var address = server.address();
   console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

//con.connect(function(err)
//{if(err) throw err;
//});
server.on('message', function (message, remote) {
   console.log(remote.address + ':' + remote.port);
   var now = Date.now();

   var packet = {
      version: '0.2'
      , type: 'data'
      , data: message
      , address: remote.address
      , port: remote.port
      , timestamp: now
      , received: new Date().toString()
   };

   db.insert(packet, function (err, newDoc) {   // Callback is optional
      // newDoc is the newly inserted document, including its _id
      var fs = require('fs');

      var data = [];
   });

   var parsedObject = dataParser.parseDataChunk(packet.data);
   if (parsedObject == null)
   {
      console.log("Unknown object");
   }
   else
   {
   /*var sql = "INSERT INTO raw (ip, data) VALUES ('" + packet.address + "','" + [ Buffer(message, 'binary') ] +"')";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("1 record inserted");
     });
   
   */
   }
});

web.listen(PORT, HOST);
server.bind(PORT, HOST);
