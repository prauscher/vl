var config = require('../config.js');

global.core = require('./' + config.backend);

exports.socketIoStore = core.socketIoStore;

exports.beamer = require('./beamer.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
exports.applications = require('./applications.js');
exports.appcategorys = require('./appcategorys.js');
