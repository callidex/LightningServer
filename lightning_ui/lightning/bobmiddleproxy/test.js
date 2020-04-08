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
	var url = 'http://localhost:9800' + req.url;
	req.pipe(request(url)).pipe(res);

});

nodeproxy.listen(3001);




