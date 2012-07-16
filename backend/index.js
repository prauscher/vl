// vim:noet:sw=8:

var config = require('../config.js');

global.core = require('./' + config.backend);

exports.socketIoStore = core.socketIoStore;

exports.projectors = require('./projectors.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
exports.motions = require('./motions.js');
exports.motionclasses = require('./motionclasses.js');
exports.pollsites = require('./pollsites.js');
exports.elections = require('./elections.js');
exports.ballots = require('./ballots.js');
exports.options = require('./options.js');
