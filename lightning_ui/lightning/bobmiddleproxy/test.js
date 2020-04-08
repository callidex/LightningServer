require('rootpath')();
const request = require('request');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// start node proxy

var nodeproxy = express();
nodeproxy.use('/', function (req, res) {
	var url = 'http://localhost:9080' + req.url;
	console.log('Forwarded to ' + url);
	req.on('error', (error) => { console.log(error) }).pipe(request(url)).on('error', (error) => { console.log(error) }).pipe(res);

});

nodeproxy.listen(3001);




