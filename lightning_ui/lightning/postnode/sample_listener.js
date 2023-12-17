require("rootpath")();
const express = require("express");
const router = express.Router();
const config = require("./config.json");
const math = require("math");
const { Client } = require('pg');
const dgram = require("dgram");
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {

  const data = Buffer.from(msg);

  var packetNumber = data.readInt32LE(0) & 0xFFFFFF;
  var tempObject = new Object;
  if (data[3] == 0 || data[3] == 4) {
    console.log("Sample packet incoming - type ", data[3]);
    tempObject.udpnumber = data.readUInt32LE(0);
    tempObject.adcseq = data[4];
    tempObject.detector = data[6];
    tempObject.rtsecs = data.readUInt32LE(7) >> 2;
    tempObject.batchid = data[8];
    console.log("Data packet with batchid ", tempObject.batchid);
    tempObject.dmatime = data.readUInt32LE(12);
    tempObject.data = [];
    for (var i = 0; i < (728 * 2); i = i + 2) {
      tempObject.data.push((data[i + 15] << 8) + data[i + 1 + 15]);
    }
    tempObject.needsprocessing = 1;
    storeSample(tempObject);

  }
  console.log(`server got msg from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(5000);

const { Pool } = require('pg');
const { smoothed_z_score } = require("./smooth");
const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  max: 300,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function storeSample(tempObject) {
  const client = await pool.connect();

  try {
    console.log("Detector :", tempObject.detector);
    var smoothed = smoothed_z_score(tempObject.data);

   var res = await client.query("INSERT INTO sample (detector, data, dmatime, batchid,rtsecs,adcseq,smoothed) VALUES ($1, $2, $3, $4, $5, $6, $7)", [tempObject.detector, tempObject.data, tempObject.dmatime, tempObject.batchid, tempObject.rtsecs, tempObject.adcseq, smoothed]);



  }
  catch (err) { console.log(err.stack) }

  finally {
    client.release();
  }
}










