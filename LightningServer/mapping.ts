import Datastore = require("nedb");
import Parser = require("./parse");

var db = new Datastore({ filename: "datastore.db", autoload: true });


function mapping(dataList: any)
{
   db.find({},
      function (err, docs) {
         if (err) throw err;
         for (var i = 0, len = docs.length; i < len; i++) {
     //       Parse.parseDataChunk(docs[i].data);
         }
      });
   
}