require("rootpath")();
const express = require("express");
const router = express.Router();
const config = require("./config.json");
const { Client } = require('pg');

//import geohash from 'latlon-geohash';



// routes
router.post("/status", status);
router.post("/strike", strike);

module.exports = router;

function strike(req, res, next) {
  console.log(req.body);
  res.status(200).end();
}

function status(req, res, next) {

  console.log(req.body);
  const incomingStatus = req.body;
  console.log(incomingStatus.LastSeen);

if(incomingStatus.clktrim > 109000000 || incomingStatus.clktrim < 107000000)
{
   console.log( 'rejected - ');
  console.log(incomingStatus);
  res.status(500).end();
	return;
} 



  ; (async () => {
    const client = new Client({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
    })
    await client.connect()
//    const geo = geohash.encode(incomingStatus.Lat, incomingStatus.Lon);
  const geo = '';
    const sql = "insert into status_hyper (stamp,detectorid, Lon,Lat,height,udpcount,clktrim,satellites,temppress,geohash,temp,press) values ("
      + "TO_TIMESTAMP('" + incomingStatus.LastSeen + "','dd.mm.YY HH24:MI:SS:MS') - (10 * interval '1 hour'),"
      + incomingStatus.id + ","
      + incomingStatus.Lon + ","
      + incomingStatus.Lat + ","
      + incomingStatus.Height + ","
      + incomingStatus.udpcount + ","
      + incomingStatus.clktrim + ","
      + incomingStatus.satellites + ","
      + incomingStatus.temppress + ",'"
      + geo + "',"
      + incomingStatus.temp + ","
      + incomingStatus.press + ");";
    console.log(sql);
    await client.query(sql);
    await client.end();
  })()
  res.status(200).end();
}

