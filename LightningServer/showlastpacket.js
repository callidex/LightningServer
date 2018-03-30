var r = require('rethinkdb');

var connection = null;
r.connect( {host: 's7.slashdit.com', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    
    
    r.db('lightning').table('rawpackets').run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
});
    
    
})