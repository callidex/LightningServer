var net = require("net");
var dgram = require("dgram");


var message = Buffer(new Uint8Array(500)); 
console.log(message);
     var client = dgram.createSocket('udp4');

//client.send("Hello I am a packet", 0, 5, 5001, "gate.wzone.co.uk");

     client.send(message, 0, message.length, 5001, 'gate.wzone.co.uk', (err) => {

         if(err)
         { 
            console.log(err);
         }
         else 
         { 
            console.log('packet forwarded to Bob'); 
         }
         
         client.close();
      });

