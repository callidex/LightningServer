declare const Buffer;
import * as peak from "./peakdetect";
import math = require('mathjs');
import rethink = require('rethinkdb');

var PacketTypeEnum = Object.freeze({ "sample": 0, "status": 1, "timedstatus": 2 });
export function parseDataChunk(dataChunk: any) {
   var len = Object.keys(dataChunk.data).length;
   var buffer = new Buffer(len);
   for (var i = 0; i < len; i++) {
      buffer[i] = dataChunk.data[i];
   }
   if (buffer.length < 1) throw -1;
   var packetType = buffer.readUInt8(3);
   var packetNumber = buffer.readInt32LE(0) & 0xFFFFFF;
   console.log("Packet number ", packetNumber);

   var tempObject = {
      "packetnumber": packetNumber,
      "packettype": packetType,
      "received": Date.now(),
      "address": dataChunk.address,
      "version": dataChunk.version
   }

   switch (packetType) {
      case PacketTypeEnum.sample:
         return parseADCSamplePacket(tempObject, buffer);
         
      case PacketTypeEnum.status:
      case PacketTypeEnum.timedstatus:
         var feedcode = buffer.readUInt32BE(buffer.length - 4);
         if (feedcode === 0xfeedc0de)
            return parseStatusPacket(tempObject, buffer)
         break;
      default:
         console.log("Unknown Packet Type");
         break;
   }
   return null;
}


function parseADCSamplePacket(tempObject, buffer) {

   tempObject.udpnumber = (buffer.readUInt32LE(0) >> 8) & 0x00ffffff;
   tempObject.adcseq = buffer[4];
   tempObject.detectoruid = (buffer.readUInt32LE(4) >> 8) & 0x3ffff;
   tempObject.rtsecs = buffer.readUInt32LE(7) >> 2;
   tempObject.batchid = buffer[8];
   tempObject.dmatime = buffer.readUInt32LE(12);
   tempObject.data = [];
   console.log("Data packet found from ");
   console.log(tempObject.detectoruid);

   for (var i = 0; i < 728; i++) {
      // be explicit for testing      
      var val = buffer[i + 15];
      var val2 = buffer[(i + 1) + 15];
      var val3 = val << 8;
      var number = val3 + val2;
      tempObject.data.push(number);
   }
   tempObject.maxval = math.max(tempObject.data);
   tempObject.minval = math.min(tempObject.data);
   tempObject.variance = tempObject.maxval - tempObject.minval;

   tempObject.mean = math.mean(tempObject.data);
   var squares = math.sum(tempObject.data.map(x => (x - tempObject.mean) * (x - tempObject.mean)));
   tempObject.stddev = math.sqrt(squares / tempObject.data.length);

   tempObject.signal = peak.peakdetect.calcpeak(tempObject.data, 5, 20);
   tempObject.signalcnt = math.sum(tempObject.signal);
   if (tempObject.signal.length != 728) throw 'signal length too short';
   if (tempObject.data.length != 728) throw 'signal length too short';
   tempObject.needsprocessing = 1;
   return tempObject;
}

function parseStatusPacket(tempObject, buffer) {

   console.log("status packet");
   if (buffer[0] & 2) {
      console.log("timed status");
   } else if (buffer[0] & 1) {
      console.log("end seq status");
   } else {
      console.log("unknown status");
   }

   var sliced = buffer.slice(4);
   var gps = gpsNavPvt(sliced);
   if (gps != null) {
      tempObject.gps = gps;
   }
   tempObject.clocktrim = sliced.readUInt32LE(84);
   tempObject.detectoruid = sliced.readUInt32LE(88) & 0x3FFFF;
   tempObject.packetssent = sliced.readUInt32LE(92);
   tempObject.triggeroffset = sliced.readUInt16LE(96);
   tempObject.triggernoise = sliced.readUInt16LE(98);
   tempObject.sysuptime = sliced.readUInt32LE(100);
   tempObject.netuptime = sliced.readUInt32LE(104);
   tempObject.gpsuptime = sliced.readUInt32LE(108);
   tempObject.majorversion = sliced[112];
   tempObject.minorversion = sliced[113];
   tempObject.avgadcnoise = sliced.readUInt16LE(114);
   tempObject.batchid = sliced[116];

   // backfilldatapacket(tempObject.clocktrim, tempObject.packetnumber, tempObject.detectoruid);

   return tempObject;
}

function backfilldatapacket(clocktrim, currentbatchid, detectoruid) {

   rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn2) {
      if (err) throw err;
      console.log(conn2);
   });
   rethink.connect({ host: 's7.slashdit.com', port: 28015 }, function (err, conn) {
      if (err) throw err;
      // find all the needsprocessing = 1 && batchnumber = currentbatchid && detectoruid

      rethink.db('lightning').table('datapackets')
         .filter({
            "needsprocessing": 1,
            "batchid": currentbatchid,
            "detectoruid": detectoruid
         })
         .run(conn, function (err, cursor) {
            if (err) throw err;

            cursor.toArray().then(function (results) {
               // results are all the data packets previously received
               results.forEach(function (changed) {
                  changed.needsprocessing = false;
                  changed.clocktrim = clocktrim;
                  // work out actual start

                  //dmatime is number of cpucycles count at end of sample
                  //clocktrim is cycles per second
                  var endsampletime = changed.dmatime / changed.clocktrim;
                  var endsampletimens = endsampletime * 1000000000;
                  var nspersample = 373;  //1,000,000,000
                  changed.firstsampletimestamp = endsampletimens - (728 * nspersample);
                  rethink.db('lightning').table('datapackets').get(results[0].id).replace(changed)
                     .run(conn, function (err, result) {
                        if (result.first_error.len > 0) { throw err; }
                     });
               });
            });
         });
   });
}

function distance(lat1, lon1, lat2, lon2, unit) {
   var radlat1 = Math.PI * lat1 / 180;
   var radlat2 = Math.PI * lat2 / 180;
   var theta = lon1 - lon2;
   var radtheta = Math.PI * theta / 180;
   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
   dist = Math.acos(dist);
   dist = dist * 180 / Math.PI;
   dist = dist * 60 * 1.1515;
   if (unit === "K") {
      dist = dist * 1.609344;
   }
   if (unit === "N") {
      dist = dist * 0.8684;
   }
   return dist;
}

function gpsNavPvt(buffer) {
   if (buffer.length == undefined) return null;

   var ret =
      {
         "iTOW": buffer.readUInt32LE(0),
         "year": buffer.readInt16LE(4),
         "month": buffer[6], // month Month, range 1..12 UTC
         "day": buffer[7], // d Day of month, range 1..31 UTC
         "hour": buffer[8], // h Hour of day, range 0..23 UTC
         "min": buffer[9], // min Minute of hour, range 0..59 UTC
         "sec": buffer[10], // s Seconds of minute, range 0..60 UTC
         "valid": buffer[11], // - Validity Flags (see graphic below)
         "tAcc": buffer.readUInt32LE(12), // ns Time accuracy estimate UTC
         "nano": buffer.readUInt32LE(buffer, 16), // ns Fraction of second, range -1e9..1e9 UTC
         "fixType": buffer[20], // - GNSSfix Type, range 0..5
         "flags": buffer[21], // - Fix Status Flags (see graphic below)
         "reserved1": buffer[22],
         "numSV": buffer[23], // - Number
         "lon": buffer.readInt32LE(24) / 1e7,
         "lat": buffer.readInt32LE(28) / 1e7,
         "height": buffer.readInt32LE(32), // mm Height above Ellipsoid
         "hMSL": buffer.readInt32LE(36), // mm Height above mean sea level
         "hAcc": buffer.readUInt32LE(40), // mm Horizontal Accuracy Estimate
         "vAcc": buffer.readUInt32LE(44), // mm Vertical Accuracy Estimate
         "velN": buffer.readInt32LE(48), // mm/s NED north velocity
         "velE": buffer.readInt32LE(52), // mm/s NED east velocity
         "velD": buffer.readInt32LE(56), // mm/s NED down velocity
         "gSpeed": buffer.readInt32LE(60), // mm/s Ground Speed (2-D)
         "heading": buffer.readInt32LE(64), // deg Heading of motion 2-D (1e-5)
         "sAcc": buffer.readUInt32LE(68), // mm/s Speed Accuracy Estimate
         "headingAcc": buffer.readInt32LE(72), // deg Heading Accuracy Estimate (1e-5)
         "pDOP": buffer.readUInt16LE(76), // - Position DOP (0.01)
         "reserved2": 0, // - Reserved  78
         "reserved3": 0 // - Reserved   80
      };
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