//var Datastore = require('nedb'), db = new Datastore({ filename: 'datastore.db', autoload: true })

var BitArray = require('node-bitarray');

function copy(src) {
   var dst = new ArrayBuffer(src.byteLength);
   new Uint8Array(dst).set(new Uint8Array(src));
   return dst;
}

module.exports = {

   parseDataChunk: function (dataChunk) {


      //console.log('parsing chunk');
      var arr = dataChunk[0];
      var len = Object.keys(dataChunk).length;
      var buffer = copy(dataChunk);

      if (len == 140) {
         return parseStatusPacket(buffer);
      }
      else if (len == 1472) {
         return parseADCSamplePacket(buffer);
      }
      console.log('object length ' + len);
      return null;
   }
}

function parseADCSamplePacket(buffer) {
   console.log("sample packet found");
   return 0;
}

function bytesTo32bit(arr) {
   var b0 = arr;
   var b0 = + arr[1] << 8;
   var b0 = + arr[2] << 16;
   var b0 = + arr[3] << 24;
   return b0;
}

function parseStatusPacket(buffer) {

   console.log("status packet");
   if (BitArray.parse(buffer[0])[1]) {
      console.log("timed status");
   }
   else if (buffer[0] & 1)
   { console.log("end seq status"); }
   else {
      console.log("unknown status");
   }

   console.log(buffer[4] + ' seconds');

   var a = [buffer[9], buffer[10], buffer[11], buffer[12]]
   var test = bytesTo32bit(
      a);

   console.log(buffer[4] + ' pps');

   return 0;
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

function toLong(buffer)
{

}

function toShort(buffer)
{

}

function toInt(buffer)
{

}

function gpsNavPvt(buffer) {
   var ret =
      {
         "iTOW": toLong(buffer.slice(0,8)),  //long
         "year": toShort(buffer.slice(8, 2)),
         "month": buffer[10], // month Month, range 1..12 UTC
         "day": buffer[11], // d Day of month, range 1..31 UTC
         "hour": buffer[12], // h Hour of day, range 0..23 UTC
         "min": buffer[13], // min Minute of hour, range 0..59 UTC
         "sec": buffer[14], // s Seconds of minute, range 0..60 UTC
         "valid": buffer[15], // - Validity Flags (see graphic below)
         "tAcc": toLong(buffer.slice([16],8)), // ns Time accuracy estimate UTC
         "nano": 0, // ns Fraction of second, range -1e9..1e9 UTC
         "fixType": 0, // - GNSSfix Type, range 0..5
         "flags": 0, // - Fix Status Flags (see graphic below)
         "reserved1": 0,
         "numSV": 0, // - Number
         "lon": 0,
         "lat": 0, // deg Latitude (1e-7)
         "height": 0, // mm Height above Ellipsoid
         "hMSL": 0, // mm Height above mean sea level
         "hAcc": 0, // mm Horizontal Accuracy Estimate
         "vAcc": 0, // mm Vertical Accuracy Estimate
         "velN": 0, // mm/s NED north velocity
         "velE": 0, // mm/s NED east velocity
         "velD": 0, // mm/s NED down velocity
         "gSpeed": 0, // mm/s Ground Speed (2-D)
         "heading": 0, // deg Heading of motion 2-D (1e-5)
         "sAcc": 0, // mm/s Speed Accuracy Estimate
         "headingAcc": 0, // deg Heading Accuracy Estimate (1e-5)
         "pDOP": 0,// - Position DOP (0.01)
         "reserved2": 0, // - Reserved
         "reserved3": 0, // - Reserved
      }
   return ret;
}
/*
uint32_t udpcount;
// udp packet sent index (24 bits, other 8 bits are packet type)
struct UbxGpsNavPvt {
   // Type Name Unit Description (scaling)
   unsigned long iTOW; // ms GPS time of week of the navigation epoch. See the description of iTOW for details. 0
   unsigned short year; // y Year UTC
   unsigned char month; // month Month, range 1..12 UTC
   unsigned char day; // d Day of month, range 1..31 UTC
   unsigned char hour; // h Hour of day, range 0..23 UTC
   unsigned char min; // min Minute of hour, range 0..59 UTC
   unsigned char sec; // s Seconds of minute, range 0..60 UTC
   char valid; // - Validity Flags (see graphic below)
   unsigned long tAcc; // ns Time accuracy estimate UTC
   long nano; // ns Fraction of second, range -1e9..1e9 UTC
   unsigned char fixType; // - GNSSfix Type, range 0..5
   char flags; // - Fix Status Flags (see graphic below)
   unsigned char reserved1; // - Reserved
   unsigned char numSV; // - Number
   long lon; // deg Longitude (1e-7)
   24
   long lat; // deg Latitude (1e-7)
   28
   long height; // mm Height above Ellipsoid
   32
   long hMSL; // mm Height above mean sea level
   36
   unsigned long hAcc; // mm Horizontal Accuracy Estimate
   40
   unsigned long vAcc; // mm Vertical Accuracy Estimate
   44
   long velN; // mm/s NED north velocity
   48
   long velE; // mm/s NED east velocity
   52
   long velD; // mm/s NED down velocity
   56
   long gSpeed; // mm/s Ground Speed (2-D)
   60
   long heading; // deg Heading of motion 2-D (1e-5)
   64
   unsigned long sAcc; // mm/s Speed Accuracy Estimate
   68
   unsigned long headingAcc; // deg Heading Accuracy Estimate (1e-5)
   72
   unsigned short pDOP; // - Position DOP (0.01)
   76
   short reserved2; // - Reserved
   78
   unsigned long reserved3; // - Reserved
   */