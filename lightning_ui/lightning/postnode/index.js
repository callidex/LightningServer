const { Client } = require('pg')
import Geohash from 'latlon-geohash';
const client = new Client({
  user: 'postgres',
  host: 'lightning.vk4ya.com',
  database: 'lightning',
  password: 'bobspostgresql',
  port: 5432,
})
client.connect()
client.query('SELECT now()', (err, res) => {
  console.log(err, res)

  var request = require('request');
  request('http://lightning.vk4ya.com:3001/strikes/99', function (error, response, body) {

    const res = JSON.parse(body);
    for (var rec in res.Strikes) {
      const record = res.Strikes[rec];
      console.log(record);
      const geo = Geohash.encode(record.lat, record.lon);

      const sql = "insert into strikes (linecount,stamp,hitx,hity,longitude,latitude,geohash, heat) values ("
        + record.linecount + ","
        + "TO_TIMESTAMP('" + record.stamp + "','dd.mm.YYYY HH24:MI:SS:MS'),"
        + record.hitx + ","
        + record.hity + ","
        + record.lon + ","
        + record.lat + ",'"
        + geo + "',"
        + record.heat + ");";

      client.query(sql, (err, res) => { console.log(err, res); });
    }
  })
})



