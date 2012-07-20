// vim:noet:sw=8:

var FlatStructure = require('../backendStructureFlat.js');

module.exports = function () {
	var self = this;

	var backend = new FlatStructure({
		sanitize : function (item) {
			return item;
		},
		broadcastChange : function (id, item) {
			self.socket.emit('ballot-change:' + id, { ballot: item });
		},
		broadcastDelete : function (id) {
			self.socket.emit('ballot-delete:' + id, {});
		},
		backend : core.ballots
	});

	backend.addOption = function (ballotid, optionid, option, callbackSuccess) {
		core.options.save(optionid, option, function () {
			core.ballots.addOption(ballotid, optionid, function (position) {
				self.socket.emit('option-add:' + ballotid, { optionid: optionid, position: position });

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	}

	backend.moveOption = function (ballotid, optionid, position, callbackSuccess) {
		core.ballots.moveOption(ballotid, optionid, position, function () {
			self.socket.emit('option-delete:' + optionid, {});
			self.socket.emit('option-add:' + ballotid, { optionid: optionid, position: position });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	}

	backend.deleteOption = function (ballotid, optionid, callbackSuccess) {
		core.ballots.deleteOption(ballotid, optionid, function () {
			backend.options.delete(optionid, callbackSuccess);
		});
	}

	backend.eachOption = function (ballotid, callback) {
		core.ballots.getOptions(ballotid, function (optionids) {
			optionids.forEach(function (optionid, n) {
				core.options.get(optionid, function (option) {
					callback(optionid, option);
				});
			});
		});
	}

	return backend;
}
