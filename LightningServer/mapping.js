var Datastore = require("nedb");
var Parser = require("./parse");

var db = new Datastore({ filename: "../../datastore.db", autoload: true });
db.find({},
   function (err, docs) {
      if (err) throw err;
      for (var i = 0, len = docs.length; i < len; i++) {
         var data = Parser.parseDataChunk(docs[i].data);
         if (data != 0) {
            console.log(data.gps.lat);
            console.log(data.gps.lon);
            console.log(data.gps.height);
         }
      }
   });