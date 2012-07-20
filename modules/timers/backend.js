// vim:noet:sw=8:

var FlatStructure = require('../backendStructureFlat.js');

module.exports = function () {
	var self = this;

	return new FlatStructure({
		sanitize : function (item) {
			var now = new Date();
			if (item.running == "true") {
				item.current = Math.max(0, item.startedValue - (now.getTime() - new Date(item.started).getTime()) / 1000);
			} else {
				item.current = item.startedValue;
			}
			return item;
		},
		broadcastAdd : function (id, item) {
			self.socket.emit('timer-add', { timerid : id, timer : item });
		},
		broadcastChange : function (id, item) {
			self.socket.emit('timer-change:' + id, { timer: item });
		},
		broadcastDelete : function (id) {
			self.socket.emit('timer-delete:' + id, {});
		},
		backend : core.timers
	});
}
