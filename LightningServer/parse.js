//var Datastore = require('nedb'), db = new Datastore({ filename: 'datastore.db', autoload: true })

module.exports = {

   parseDataChunk: function (dataChunk) {

      //console.log('parsing chunk');
      var arr = dataChunk[0];
      var len = Object.keys(dataChunk).length;
      if (len == 140) {
         return parseStatusPacket(dataChunk);
      }
      else if (len == 1472) {
         return parseADCSamplePacket(dataChunk);
      }
      return null;
   }
}

function parseADCSamplePacket(dataChunk) {
   //console.log("Sample packet found");
}

function bytesTo32bit(arr) {
   var b0 = arr;
   var b0 = + arr[1] << 8;
   var b0 = + arr[2] << 16;
   var b0 = + arr[3] << 24;

   return b0;
}

function parseStatusPacket(dataChunk) {
   
   if (dataChunk[0] & 2) {
      console.log("timed status");
   }
   else if (dataChunk[0] & 1)
   { console.log("end seq status"); }
   else {
      console.log("unknown status");
   }

   console.log(dataChunk[4] + ' seconds');

   var a = [dataChunk[9], dataChunk[10], dataChunk[11], dataChunk[12]]
   var test = bytesTo32bit(
      a);

   console.log(dataChunk[4] + ' pps');

}

//db.find({}, function (err, docs) {
//   if (err) throw err;
//   console.log('Founds docs');

//   for (var i = 0, len = docs.length; i < len; i++) {
//      parse(docs[i]);
//   }
//});

function distance(lat1, lon1, lat2, lon2, unit) {
   var radlat1 = Math.PI * lat1 / 180
   var radlat2 = Math.PI * lat2 / 180
   var theta = lon1 - lon2
   var radtheta = Math.PI * theta / 180
   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
   dist = Math.acos(dist)
   dist = dist * 180 / Math.PI
   dist = dist * 60 * 1.1515
   if (unit == "K") { dist = dist * 1.609344 }
   if (unit == "N") { dist = dist * 0.8684 }
   return dist
}



