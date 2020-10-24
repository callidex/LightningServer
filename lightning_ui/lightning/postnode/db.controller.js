require("rootpath")();
const express = require("express");
const router = express.Router();
const config = require("./config.json");
const { Client } = require('pg');

//import geohash from 'latlon-geohash';


const { Pool } = require('pg')
const pool = new Pool({
          user: config.user,
          host: config.host,
          database: config.database,
          password: config.password,
          port: config.port,
          });




// routes
router.post("/status", status);
router.post("/strike", strike);

module.exports = router;

function strike(req, res, next) {
  console.log(req.body);
  const incomingStrike = req.body;
;(async function() {
  const client = await pool.connect()
  




await client.query('SELECT NOW()')
  client.release()
})()


  ;(async () =>  
    {
       const client = new Client({
          user: config.user,
          host: config.host,
          database: config.database,
          password: config.password,
          port: config.port,
          });
       await client.connect()
       const sql = "insert into strikes_hyper(stamp,linecount,heat,hity,hitx,longitude,latitude)  values ("
+ "TO_TIMESTAMP('" + incomingStrike.stamp + "','dd.mm.YY HH24:MI:SS:MS') - (10 * interval  '1 hour'),"
  + incomingStrike.linecount + ","
  + incomingStrike.heat + ","
 +  incomingStrike.hity + ","
 +  incomingStrike.hitx + ","
 +  incomingStrike.lon + ","
 + incomingStrike.lat + ") RETURNING id;";
       console.log(sql);


const result =  await client.query(sql);

const dlist = incomingStrike.dlist.split(",");
for (var dec in dlist)
{
    const dec_id = dlist[dec].split("<")[0];
    const insert = "insert into strike_detector(strike_id,detector_id) values (" + result.rows[0].id + "," + dec_id + ");";
    await client.query(insert);
}

console.log('done')
//
//       await client.query(sql ,[],(err, res) =>
//{
//   if (err) 
 //  {
//console.log('callback error')
//      console.log(err.stack);
//
//   }
//   else
//   {
//     console.log('SUCCESS')
//      console.log(err.rows[0]);
//    }
//
// })
       client.end()
    })()
    res.status(200).end();
}

function status(req, res, next) {
  console.log(req.body);
  const incomingStatus = req.body;
  console.log(incomingStatus.LastSeen);
//  if(incomingStatus.clktrim > 109000000 || incomingStatus.clktrim < 107000000)
//{
//     console.log( 'rejected - ');
//     console.log(incomingStatus);
//     res.status(500).end();
//     return;
//  } 

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
    const sql = "insert into status_hyper (stamp,detectorid, Lon,Lat,height,udpcount,clktrim,satellites,temppress,geohash,temp,press,adctrigoff,adcbase,noise,peaklevel,trigcount,pgagain, jabbering, batchid, splatrev, sensetype,adcpktssent,sysuptime,netuptime,gpsuptime,majorversion,minorversion,auxstatus,adcudpover,udpsent,bconf,gpslocked,epochsecs) values ("
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
client .end()
  })()
  res.status(200).end();
}
