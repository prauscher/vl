// vim:noet:ts=4:sw=4:

var nohm = require('nohm').Nohm;
nohm.setPrefix('vl');
nohm.setPublish(true);

var Projector = nohm.model('Projector', {
    properties: {
        name: { type: 'string' },
        color: { type: 'string' }
    }
});

module.exports.Projector = Projector;
module.exports.connect = function(cb) {
	var readWriteClient = require('redis').createClient(config.redis);
	readWriteClient.on('connect', function() {
		nohm.setClient(readWriteClient);
		var pubSubClient = require('redis').createClient(config.redis);
		pubSubClient.on('connect', function() {
			nohm.setPubSubClient(pubSubClient);
			cb();
		});
	});
}
