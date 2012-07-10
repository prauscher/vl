var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastChange : function (id, item) {
		ballotSocket.emit('option-change:' + id, { option: item });
	},
	broadcastDelete : function (id) {
		ballotSocket.emit('option-delete:' + id, {});
	},
	backend : core.options
});
