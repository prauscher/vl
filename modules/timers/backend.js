// vim:noet:sw=8:

var FlatStructure = require('../backendStructureFlat.js');

module.exports = new FlatStructure({
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
		timerSocket.emit('timer-add', { timerid : id, timer : item });
	},
	broadcastChange : function (id, item) {
		timerSocket.emit('timer-change:' + id, { timer: item });
	},
	broadcastDelete : function (id) {
		timerSocket.emit('timer-delete:' + id, {});
	},
	backend : core.timers
});
