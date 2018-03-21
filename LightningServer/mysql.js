var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bdars",
  database: "lightning"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

//var sql = "DROP TABLE raw;";
 var sql = " CREATE TABLE raw (id INT AUTO_INCREMENT PRIMARY KEY,ip VARCHAR(255), data VARBINARY(1500), ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");


  });
});



