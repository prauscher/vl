// vim:noet:ts=4:sw=4:

var redis = require('redis');

global.db = Object.create(redis.createClient());
db.on("error", function(err) {
	console.log("Redis Error: " + err);
});

/*var Projector = DBObject('projector');
module.exports.AgendaItem = AgendaItem;
module.exports.Ballot = Ballot;
module.exports.Election = Election;
module.exports.Motion = Motion;
module.exports.PollSite = PollSite;
module.exports.Timer = Timer;*/
