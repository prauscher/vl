// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	return function (socket) {
		socket.on('registerpollsites', function (data) {
			self.backend.getAll(function (pollsiteid, pollsite) {
				socket.emit('pollsite-add', {pollsiteid: pollsiteid, pollsite: pollsite});
			});
		});
	}
}
