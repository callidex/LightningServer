var Datastore = require("nedb");
var parser = require("./parse");
var parseddb = new Datastore({ filename: "../../parsed.db", autoload: true });

var db = new Datastore({ filename: "../../datastore.db", autoload: true });
db.find({},
   function (err, docs) {

      var persistResolvedData = function (dataObject) {
         parseddb.insert(dataObject);
      };
      if (err) {
         console.log(err);
         throw err;
      }
      console.log("found " + docs.length + " docs");
      for (var i = 0, len = docs.length; i < len; i++) {
         var data = parser.parseDataChunk(docs[i].data);

         if (data) {

            if (data.packettype != "undefined") {
               persistResolvedData(data);
            }

            if (data.packettype != 0) {
               console.log(data.gps.lat);
               console.log(data.gps.lon);
               console.log(data.gps.height);
            }
         }
      }
   });