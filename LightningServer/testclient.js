var port = 5000;
var host = "127.0.0.1";

var dgram = require("dgram");
var message = new Buffer("Test data, arbtrary byte buffer ");

var client = dgram.createSocket("udp4");
client.send(message,
   0,
   message.length,
   port,
   host,
   function(err, bytes) {
      if (err) throw err;
      console.log("UDP message sent to " + host + ":" + port);
      client.close();
   });