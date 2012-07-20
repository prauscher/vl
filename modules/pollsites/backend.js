// vim:noet:sw=8:

var FlatStructure = require("../backendStructureFlat.js");

module.exports = function () {
	var self = this;

	return new FlatStructure({
		sanitize : function (item) {
			return item;
		},
		broadcastAdd : function (id, item) {
			self.socket.emit('pollsite-add', { pollsiteid : id, pollsite: item });
		},
		broadcastChange : function (id, item) {
			self.socket.emit('pollsite-change:' + id, { pollsite: item });
		},
		broadcastDelete : function (id) {
			self.socket.emit('pollsite-delete:' + id, {});
		},
		backend : core.pollsites
	});
}
