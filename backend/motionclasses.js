// vim:noet:sw=8:

var HierarchicalStructure = require('./structure/hierarchical.js');

module.exports = new HierarchicalStructure({
	sanitize : function(item) {
		return item;
	},
	broadcastAdd : function (parentid, id, pos) {
		motionSocket.emit(getMotionClassAddPublish(parentid), { motionclassid: id, position: pos });
	},
	broadcastChange : function (id, item) {
		motionSocket.emit('motionclass-change:' + id, { motionclass: item });
	},
	broadcastMove : function (id, parentid, item, position) {
		motionSocket.emit('motionclass-delete:' + id, {});
		motionSocket.emit(getMotionClassAddPublish(parentid), { motionclassid: id, position: position});
	},
	broadcastDelete : function (id) {
		motionSocket.emit('motionclass-delete:' + id, {});
	},
	backend : core.motionclasses
});

function getMotionClassAddPublish(id) {
	if (typeof id == 'undefined' || ! id) {
		return "motionclass-add";
	} else {
		return "motionclass-add:" + id;
	}
}

module.exports.eachMotion = function (id, callback) {
	var self = this;
	core.motionclasses.getMotions(id, function (motionids) {
		motionids.forEach(function (motionid) {
			backend.motions.get(motionid, function (motion) {
				callback(motionid, motion);
			});
		});
	});
}

module.exports.getNextMotionID = function (id, callback) {
	core.motionclasses.getNextMotionID(id, function(nextMotionID) {
		callback && callback(nextMotionID);
	});
}
