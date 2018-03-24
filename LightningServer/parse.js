﻿var Datastore = require('nedb'), db = new Datastore({ filename: 'datastore.db', autoload: true })

var Int64LE = require("int64-buffer").Int64LE;
var Int64BE = require("int64-buffer").Int64BE;


module.exports = {

   parseDataChunk: function (dataChunk) {
     
      var len = Object.keys(dataChunk).length;
      var buffer = [];
      for (var i = 0; i < len; i++)
      {
         buffer.push(dataChunk[i]);
      }

      if (buffer.length < 1) throw -1;
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

function parseStatusPacket(buffer) {

   console.log("status packet");
   if (buffer[0] & 2) {
      console.log("timed status");
   }
   else if (buffer[0] & 1)
   { console.log("end seq status"); }
   else {
      console.log("unknown status");
   }

  
   console.log(buffer[4] + ' pps');

   var gps = gpsNavPvt(buffer.slice(8));
   if (gps != null) {
      console.log("lat = " + gps.lat);
      console.log("lon = " + gps.lon);
   }

   return 0;
}

db.find({}, function (err, docs) {
   if (err) throw err;
   console.log('Founds docs');

   for (var i = 0, len = docs.length; i < len; i++) {

      module.exports.parseDataChunk(docs[i].data);
   }
});

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

function gpsNavPvt(buffer) {
   console.log(buffer.length);
   var ret =
      {
         "iTOW": new Int64LE(buffer, 0),  //long
         "year": new Int16Array(buffer, 8, 1)[0],
         "month": buffer[10], // month Month, range 1..12 UTC
         "day": buffer[11], // d Day of month, range 1..31 UTC
         "hour": buffer[12], // h Hour of day, range 0..23 UTC
         "min": buffer[13], // min Minute of hour, range 0..59 UTC
         "sec": buffer[14], // s Seconds of minute, range 0..60 UTC
         "valid": buffer[15], // - Validity Flags (see graphic below)
         "tAcc": new Int64LE(buffer, 16), // ns Time accuracy estimate UTC
         "nano": new Int64LE(buffer, 24), // ns Fraction of second, range -1e9..1e9 UTC
         "fixType": buffer[25], // - GNSSfix Type, range 0..5
         "flags": buffer[26], // - Fix Status Flags (see graphic below)
         "reserved1": buffer[27],
         "numSV": buffer[28], // - Number
         "lon": new Int64LE(buffer, 29),
         "lat": new Int64LE(buffer, 37), // deg Latitude (1e-7)
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