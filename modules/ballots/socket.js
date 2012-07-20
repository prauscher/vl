// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	return function (socket) {
		socket.on('registerballot', function (data) {
			self.backend.get(data.ballotid, function (ballot) {
				if (ballot == null) {
					socket.emit('err:ballot-not-found:' + data.ballotid, {});
				} else {
					socket.emit('ballot-change:' + data.ballotid, { ballot : ballot });
				}
			});

			var position = 0;
			self.backend.eachOption(data.ballotid, function (optionid, option) {
				socket.emit('option-add:' + data.ballotid, { optionid : optionid, position: position++ });
			});
		});

		socket.on('registeroption', function (data) {
			self.options.backend.get(data.optionid, function (option) {
				if (option == null) {
					socket.emit('err:option-not-found:' + data.optionid, {});
				} else {
					socket.emit('option-change:' + data.optionid, { option: option });
				}
			});
		});
	}
}
