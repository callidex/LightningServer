var Datastore = require("nedb");
var parseddb = new Datastore({ filename: "../../parsed.db", autoload: true });
var db = new Datastore({ filename: "../../datastore.db", autoload: true });

db.find({}).sort({timestamp : -1}).limit(1).exec(
   function (err, docs) {
console.log(docs);
   });