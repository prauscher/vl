var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (id, item) {
		ballotSocket.emit('ballot-add', { ballotid : id, ballot: item });
	},
	broadcastChange : function (id, item) {
		ballotSocket.emit('ballot-change:' + id, { ballot: item });
	},
	broadcastDelete : function (id) {
		ballotSocket.emit('ballot-delete:' + id, {});
	},
	backend : core.ballots
});
