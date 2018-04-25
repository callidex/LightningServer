'use strict';
const math = require('mathjs')
const peak = require("./peakdetect");

var PacketTypeEnum = Object.freeze({ "sample": 0, "status": 1, "timedstatus": 2 });
module.exports = {
    parseDataChunk: function (dataChunk, conn) {
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
            "received": dataChunk.timestamp,
            "address": dataChunk.address,
            "version": dataChunk.version
        }

        switch (packetType) {
            case PacketTypeEnum.sample:
                return parseADCSamplePacket(tempObject, buffer);
                break;
            case PacketTypeEnum.status:
            case PacketTypeEnum.timedstatus:
                var feedcode = buffer.readUInt32BE(buffer.length - 4);
                if (feedcode === 0xfeedc0de)
                {
                    return parseStatusPacket(tempObject, buffer, conn)
                }
                break;
            default:
                console.log("Unknown Packet Type");
                break;
        }
        return null;
    }
};

function parseADCSamplePacket(tempObject, buffer) {

    tempObject.udpnumber = (buffer.readUInt32LE(0) >> 8) & 0x00ffffff;
    tempObject.adcseq = buffer[4];
    tempObject.detectoruid = (buffer.readUInt32LE(4) >> 8) & 0x3ffff;
    tempObject.rtsecs = buffer.readUInt32LE(7) >> 2;
    tempObject.batchid = buffer[8];
    console.log("Data packet with batchid ", tempObject.batchid);
    tempObject.dmatime = buffer.readUInt32LE(12);
    tempObject.data = [];
    for (var i = 0; i < (728*2); i = i + 2) {
        tempObject.data.push((buffer[i + 15] << 8) + buffer[i + 1 + 15]);
    }
    tempObject.maxval = math.max(tempObject.data);
    tempObject.minval = math.min(tempObject.data);
    tempObject.variance = tempObject.maxval - tempObject.minval;

    tempObject.mean = math.mean(tempObject.data);
    var squares = math.sum(tempObject.data.map(x => (x - tempObject.mean) * (x - tempObject.mean)));
    tempObject.stddev = math.sqrt(squares / tempObject.data.length);

    tempObject.signal = peak.calcpeak(tempObject.data, 5);
    tempObject.signalcnt = tempObject.signal.reduce(function (a, b) { return a + b; }, 0);

    tempObject.needsprocessing = 1;
    return tempObject;
}

function parseStatusPacket(tempObject, buffer, conn) {

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
    return tempObject;
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
