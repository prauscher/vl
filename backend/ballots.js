var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastChange : function (id, item) {
		ballotSocket.emit('ballot-change:' + id, { ballot: item });
	},
	broadcastDelete : function (id) {
		ballotSocket.emit('ballot-delete:' + id, {});
	},
	backend : core.ballots
});

module.exports.addOption = function (ballotid, optionid, option, callbackSuccess) {
	core.options.save(optionid, option, function () {
		core.ballots.addOption(ballotid, optionid, function (position) {
			ballotSocket.emit('option-add:' + ballotid, { optionid: optionid, position: position });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

module.exports.moveOption = function (ballotid, optionid, position, callbackSuccess) {
	core.ballots.moveOption(ballotid, optionid, position, function () {
		ballotSocket.emit('option-delete:' + optionid, {});
		ballotSocket.emit('option-add:' + ballotid, { optionid: optionid, position: position });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

module.exports.deleteOption = function (ballotid, optionid, callbackSuccess) {
	core.ballots.deleteOption(ballotid, optionid, function () {
		backend.options.delete(optionid, callbackSuccess);
	});
}

module.exports.eachOption = function (ballotid, callback) {
	core.ballots.getOptions(ballotid, function (optionids) {
		optionids.forEach(function (optionid, n) {
			core.options.get(optionid, function (option) {
				callback(optionid, option);
			});
		});
	});
}
