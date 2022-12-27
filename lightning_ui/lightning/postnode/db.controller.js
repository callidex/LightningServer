require("rootpath")();
const express = require("express");
const router = express.Router();
const config = require("./config.json");
const { Client } = require('pg');
//import geohash from 'latlon-geohash';
const io = require('@pm2/io');
const strikeCounter = io.counter({   name: 'LightSrv strike count',   id: 'app/realtime/strike' });
const statusCounter = io.counter({   name: 'LightSrv status count',   id: 'app/realtime/status' });
const { Pool } = require('pg')
const pool = new Pool({           user: config.user,           host: config.host,           database: config.database,           password: config.password,           port: config.port,  

   max: 300,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
          });

// routes
router.post("/status", status);
router.post("/strike", strike);

module.exports = router;

function strike(req, res, next) {
   strikeCounter.inc();

  const incomingStrike = req.body;
;(async function() {
  const client = await pool.connect()
       const sql = "insert into strikes_hyper(stamp,linecount,heat,hity,hitx,longitude,latitude)  values ("
      + "TO_TIMESTAMP('" + incomingStrike.stamp + "','dd.mm.YY HH24:MI:SS:MS') - (10 * interval  '1 hour'),"
      + incomingStrike.linecount + ","
      + incomingStrike.heat + ","
      +  incomingStrike.hity + ","
      +  incomingStrike.hitx + ","
      +  incomingStrike.lon + ","
      + incomingStrike.lat + ") RETURNING id;";
  console.log(sql);
  try
  {
   const result =  await client.query(sql);
   const dlist = incomingStrike.dlist.split(",");
   for (var dec in dlist)
   {
      const dec_id = dlist[dec].split("<")[0];
      const insert = "insert into strike_detector(strike_id,detector_id) values (" + result.rows[0].id + "," + dec_id + ");";
      await client.query(insert);
   }
   console.log('done')
  }
  finally
  {
    client.release()
  }  
 })()
    res.status(200).end();
}

function status(req, res, next) {
  statusCounter.inc();
  const incomingStatus = req.body;
  ; (async () => {


    const client =  await pool.connect()
    try
   {
     const geo = '';
     const sql = "insert into status (stamp,detectorid, Lon,Lat,udpcount,clktrim,satellites,temppress,geohash,temp,press,adctrigoff,adcbase,noise,peaklevel,trigcount,pgagain, jabbering, batchid, splatrev, sensetype,adcpktssent,sysuptime,netuptime,gpsuptime,majorversion,minorversion,auxstatus,adcudpover,udpsent,bconf,gpslocked,epochsecs) values ("
      + "TO_TIMESTAMP('" + incomingStatus.LastSeen + "','dd.mm.YY HH24:MI:SS:MS') - (10 * interval '1 hour'),"
      + incomingStatus.id + ","
      + incomingStatus.Lon + ","
      + incomingStatus.Lat + ","
//      + incomingStatus.Height + ","
      + incomingStatus.udpcount + ","
      + incomingStatus.clktrim + ","
      + incomingStatus.satellites + ","
      + incomingStatus.temppress + ",'"
      + geo + "',"
      + incomingStatus.temp + ","
      + incomingStatus.press + ","
      + incomingStatus.adctrigoff + ","
      + incomingStatus.adcbase + "," 
      + incomingStatus.noise + ","
      + incomingStatus.peaklevel + ","
      + incomingStatus.trigcount  + ","
      + incomingStatus.pgagain + ","
      + incomingStatus.jabbering  + ","
      + incomingStatus.batchid + ","
      + incomingStatus.splatrev + ","
      + incomingStatus.sensetype   + ","
      + incomingStatus.adcpktssent+ ","
      + incomingStatus.sysuptime+ ","
      + incomingStatus.netuptime+ ","
      + incomingStatus.gpsuptime+ ","
      + incomingStatus.majorversion+ ","
      + incomingStatus.minorversion+ ","
      + incomingStatus.auxstatus1+ ","
      + incomingStatus.adcudpover+ ","
      + incomingStatus.udpsent+ ","
      + incomingStatus.bconf+ ","
      + incomingStatus.gpslocked + ","
      + incomingStatus.epochsecs+ " );";
console.log(sql);
      await client.query(sql);
}
finally
{
   client .release()
}  })()
  res.status(200).end();
}
