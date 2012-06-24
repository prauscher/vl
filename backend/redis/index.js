var redis = require('redis'),
    socketio = require('socket.io'),
    config = require('../../config.js');

global.db = redis.createClient();

exports.socketIoStore = new socketio.RedisStore({ redisPub: config.redis, redisSub: config.redis, redisClient: config.redis });

exports.beamer = require('./beamer.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
