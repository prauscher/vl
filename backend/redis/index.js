// vim:noet:sw=8:

var redis = require('redis'),
    socketio = require('socket.io'),
    config = require('../../config.js');

global.db = redis.createClient(config.redis.port, config.redis.host, config.redis);

global.db._lmove = function(item, sourceKey, destinationKey, destinationPosition, callback) {
	db.lrem(sourceKey, 0, item, function(err) {
		db.lindex(destinationKey, destinationPosition, function(err, elem) {
			if (elem) {
				db.linsert(destinationKey, "BEFORE", elem, item, function(err) {
					if (callback) callback();
				})
			} else {
				db.rpush(destinationKey, item, function(err) {
					if (callback) callback();
				})
			}
		});
	});
}

exports.socketIoStore = new socketio.RedisStore({ redisPub: config.redis, redisSub: config.redis, redisClient: config.redis });

exports.projectors = require('./projectors.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
exports.motions = require('./motions.js');
exports.motionclasses = require('./motionclasses.js');
exports.pollsites = require('./pollsites.js');
exports.elections = require('./elections.js');
exports.ballots = require('./ballots.js');
exports.options = require('./options.js');
exports.votes = require('./votes.js');
