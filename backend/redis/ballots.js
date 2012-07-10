var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'ballots'
});

module.exports.addOption = function (ballotid, optionid, callback) {
	db.rpush('ballots:' + ballotid + ':options', optionid, function (err, position) {
		callback(position - 1);
	})
}

module.exports.moveOption = function (ballotid, optionid, position, callback) {
	db._lmove(optionid, 'ballots:' + ballotid + ':options', 'ballots:' + ballotid + ':options', position, function () {
		callback();
	});
}

module.exports.deleteOption = function (ballotid, optionid, callback) {
	db.lrem('ballots:' + ballotid + ':options', 0, optionid, function () {
		callback();
	});
}

module.exports.getOptions = function (ballotid, callback) {
	db.lrange('ballots:' + ballotid + ':options', 0, -1, function (err, optionids) {
		callback(optionids);
	});
}
