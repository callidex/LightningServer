const express = require("express");
const app = express();
const errorHandler = require("./errorhandler");
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/db", require("./db.controller"));
app.use(errorHandler);


const port = process.env.PORT || 3030;

app.listen(port, function () {
  log("Server listening on port " + port);
});


function log(message) {
  console.log(new Date() + " : " + message);
}
