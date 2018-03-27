'use strict';
module.exports = function(app) 
{
  var lightning = require('../controllers/lightningController');

  app.route('/packets').get(lightning.list_all_packets);

//  app.route('/tasks/:taskId').get(lightning.read_a_task);
};