var redis = require('redis'),
    socketio = require('socket.io');

global.db = redis.createClient();

exports.socketIoStore = new socketio.RedisStore();

exports.beamer = require('./beamer.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
