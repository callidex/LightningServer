var PORT = 5000;
var HOST = '0.0.0.0';

var net = require('net');

var web = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bdars",
  database: "lightning"
});

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var Datastore = require('nedb'), db = new Datastore({ filename: 'datastore.db', autoload: true })

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port);

    var packet = {
        type: 'data'
        , data: message
        , address: remote.address
        , port: remote.port
        , timestamp: Date.now()

    };

    db.insert(packet, function (err, newDoc) {   // Callback is optional
        // newDoc is the newly inserted document, including its _id
        var fs = require('fs');

        var data = [];

        // this is a quick hack to only store 'data'
        // should check the packet type, potentially have seperate store for GPS entries, then a foreign key between
        // source IP and the GPS, use the IP for grouping / sorting the data packets
        
        //first 8 bytes are type
        
/*        
        if (message.length == 1472) {

            for (var i = 0; i < message.length; i++) {
                var low = message[i];
                var high = message[i+1];
                var val = low | high << 8;
                if(val >0 && val < 2048)
                data.push(val);
                i++;
            }


            fs.writeFile('datasample.csv', data, 'utf8', function (err) {
                if (err) {
                    console.log('Some error occured - file either not saved or corrupted file saved.');
                } else {
                    console.log('It\'s saved!');
                }


            });
        }
  */  });

con.connect(function(err) {
  if (err) throw err;
});

var sql = "INSERT INTO raw (ip, data) VALUES ('" + packet.address + "','X" + packet.data +"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });






});
 
web.listen(PORT,HOST);
server.bind(PORT, HOST);
