// vim:noet:sw=8:

var config = require('../config.js');

global.core = require('./' + config.backend);

exports.socketIoStore = core.socketIoStore;
