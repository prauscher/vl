// vim:noet:sw=8:

var HierarchicalStructure = require('../backendStructureHierarchical.js');

module.exports = function () {
	var self = this;

	return new HierarchicalStructure({
		sanitize : function (item) {
			return item;
		},
		broadcastAdd : function (parentid, id, pos) {
			self.socket.emit(getAgendaAddPublish(parentid), { slideid : id, position : pos });
		},
		broadcastChange : function (id, item) {
			self.socket.emit('slide-change:' + id, { slide : item });
		},
		broadcastMove : function (id, parentid, item, position) {
			self.socket.emit('slide-delete:' + id, {});
			self.socket.emit(getAgendaAddPublish(parentid), {slideid : id, position: position});
		},
		broadcastDelete : function (id) {
			self.socket.emit('slide-delete:' + id, {});
		},
		backend : core.agenda
	});
}

function getAgendaAddPublish(id) {
	if (typeof id == 'undefined' || ! id) {
		return "slide-add";
	} else {
		return "slide-add:" + id;
	}
}
