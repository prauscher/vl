var HierarchicalStructure = require('./structure/hierarchical.js');

module.exports = new HierarchicalStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (parentid, id, pos) {
		agendaSocket.emit('slide-add:' + parentid, { slideid : id, position : pos });
	},
	broadcastChange : function (id, item) {
		agendaSocket.emit('slide-change:' + id, { slide : item });
	},
	broadcastMove : function (id, parentid, item, position) {
		agendaSocket.emit('slide-delete:' + id, {});
		agendaSocket.emit('slide-add:' + parentid, {slideid : id, slide: item, position: position});
	},
	broadcastDelete : function (id) {
		agendaSocket.emit('slide-delete:' + id, {});
	},
	backend : core.agenda
});

// Do not use a private variable here: It will mess up the this-pointer
module.exports._add = module.exports.add;

module.exports.add = function (id, item, callbackSuccess) {
	var self = this;
	if (! item.parentid) {
		this.getRootSlide(function (rootid, rootitem) {
			if (rootitem == null) {
				self.setRootSlideID(id);
				self.save(id, item, function () {
					agendaSocket.emit('slide-add', { slideid : id });

					if (callbackSuccess) {
						callbackSuccess();
					}
				});
			} else {
				item.parentid = rootid;
				self._add(id, item, callbackSuccess);
			}
		});
	} else {
		self._add(id, item, callbackSuccess);
	}
}

module.exports.getRootSlideID = function (callback) {
	core.agenda.getRootSlideID(function (rootid) {
		if (callback) {
			callback(rootid);
		}
	});
}

module.exports.setRootSlideID = function (rootid, callbackSuccess) {
	core.agenda.setRootSlideID(rootid, function () {
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

module.exports.getRootSlide = function (callback) {
	var self = this;
	this.getRootSlideID(function (rootid) {
		self.get(rootid, function (rootitem) {
			callback(rootid, rootitem);
		});
	});
}
