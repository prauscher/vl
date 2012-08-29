// vim:noet:ts=4:sw=4:

var nohm = require('nohm').Nohm;
nohm.setPublish(true);

module.exports.Projector = nohm.model('Projector', {
	properties: {
		name: { type: 'string' },
		color: { type: 'string' },
		isVisible: { type: 'boolean', defaultValue: false }
	}
});

module.exports.Timer = nohm.model('Timer', {
	properties: {
		name: { type: 'string' },
		color: { type: 'string' },
		running: { type: 'boolean' },
		lastStarted: { type: 'timestamp' }
	}
});

module.exports.connect = function(cb) {
	var readWriteClient = require('redis').createClient(config.redis);
	readWriteClient.on('connect', function() {
		module.exports.db = readWriteClient;
		nohm.setClient(readWriteClient);
		var pubSubClient = require('redis').createClient(config.redis);
		pubSubClient.on('connect', function() {
			nohm.setPubSubClient(pubSubClient);
			cb();
		});
	});
}
