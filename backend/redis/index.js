var redis = require('redis'),
    socketio = require('socket.io'),
    config = require('../../config.js');

global.db = redis.createClient();
global.db._zreorder = function(key, startscore, endscore, incrby, callback) {
	db._ziteratepartial(key, startscore, endscore, function (item) {
		db.zincr(key, item, incrby);
	});
	if (callback) {
		callback();
	}
}
global.db._ziteratepartial = function(key, startscore, endscore, callback) {
	db.zrange(key, startscore, endscore, function (err, items) {
		if (items) {
			items.forEach(function (item) {
				callback(item);
			});
		}
	});
}
global.db._zmove = function(item, sourceKey, destinationKey, destinationPosition, callback) {
	db.zscore(sourceKey, item, function (err, sourcePosition) {
		// Add 1 to sourcePosition to avoid a racecondition beween zincr and zrem on the same id
		db._zreorder(sourceKey, sourcePosition + 1, "+inf", -1);
		db.zrem(sourceKey, item, function(err) {
			db._zreorder(destinationKey, destinationPosition, "+inf", 1, function () {
				db.zadd(destinationKey, destinationPosition, item, callback);
			});
		});
	});
}

exports.socketIoStore = new socketio.RedisStore({ redisPub: config.redis, redisSub: config.redis, redisClient: config.redis });

exports.beamer = require('./beamer.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
