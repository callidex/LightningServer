var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var Datastore = require('nedb') , db = new Datastore({ filename: 'datastore.db', autoload: true })

server.on('listening', function () {
   var address = server.address();
   console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
   console.log(remote.address + ':' + remote.port + ' - ' + message);

   var packet = {
       type: 'data'
      , data: message
      , address: remote.address
      , port: remote.port
    
   };

   db.insert(packet, function (err, newDoc) {   // Callback is optional
      // newDoc is the newly inserted document, including its _id
   });

});

server.bind(PORT, HOST);