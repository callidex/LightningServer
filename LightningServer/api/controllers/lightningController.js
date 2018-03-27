'use strict';

var Datastore = require("nedb"); 

exports.list_all_packets = function(req, res) 
{
   var db = new Datastore({ filename: "../../datastore.db", autoload: true });
   db.find({}, function (err, docs) 
      {
          if (err)  res.send(err);
    res.json(docs);    
    });
    };
                                            
                                            