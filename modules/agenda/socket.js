// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	return function (socket) {
		socket.on('registeragenda', function (data) {
			// client may ask for children
			var position = 0;
			self.backend.eachChildren(null, function(slideid, slide) {
				socket.emit('slide-add', {slideid: slideid, position: position++});
			});
		});

		socket.on('registerslide', function (data) {
			self.backend.get(data.slideid, function (slide) {
				if (slide == null) {
					socket.emit('err:slide-not-found:' + data.slideid, {});
				} else {
					socket.emit('slide-change:' + data.slideid, { slide: slide });
				}
			});

			if (data.sendChildren) {
				// Send children
				var position = 0;
				self.backend.eachChildren(data.slideid, function(subslideid, subslide) {
					socket.emit('slide-add:' + data.slideid, {slideid: subslideid, position: position++});
				});
			}
		});
	}
}
