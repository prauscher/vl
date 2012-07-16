var HierarchicalStructure = require('./structure/hierarchical.js');

module.exports = new HierarchicalStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (parentid, id, pos) {
		agendaSocket.emit(getAgendaAddPublish(parentid), { slideid : id, position : pos });
	},
	broadcastChange : function (id, item) {
		agendaSocket.emit('slide-change:' + id, { slide : item });
	},
	broadcastMove : function (id, parentid, item, position) {
		agendaSocket.emit('slide-delete:' + id, {});
		agendaSocket.emit(getAgendaAddPublish(parentid), {slideid : id, position: position});
	},
	broadcastDelete : function (id) {
		agendaSocket.emit('slide-delete:' + id, {});
	},
	backend : core.agenda
});

function getAgendaAddPublish(id) {
	if (typeof id == 'undefined' || ! id) {
		return "slide-add";
	} else {
		return "slide-add:" + id;
	}
}
