// vim:noet:sw=8:

var FlatStructure = require("../backendStructureFlat.js");

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (id, item) {
		pollsiteSocket.emit('pollsite-add', { pollsiteid : id, pollsite: item });
	},
	broadcastChange : function (id, item) {
		pollsiteSocket.emit('pollsite-change:' + id, { pollsite: item });
	},
	broadcastDelete : function (id) {
		pollsiteSocket.emit('pollsite-delete:' + id, {});
	},
	backend : core.pollsites
});
