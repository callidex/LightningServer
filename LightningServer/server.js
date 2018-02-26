var PORT = 5000;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var Datastore = require('nedb'), db = new Datastore({ filename: 'datastore.db', autoload: true })

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
        var fs = require('fs');

        var data = [];

        if (message.length > 1300) {

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
    });

});
 

server.bind(PORT, HOST);