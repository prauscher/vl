// vim:noet:sw=8:

module.exports = function (socket) {
	socket.on('registerpollsites', function (data) {
		backend.pollsites.getAll(function (pollsiteid, pollsite) {
			socket.emit('pollsite-add', {pollsiteid: pollsiteid, pollsite: pollsite});
		});
	});
}
