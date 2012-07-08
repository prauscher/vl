var HierarchicalStructure = require('./structure/hierarchical.js');

module.exports = new HierarchicalStructure({
	sanitize : function(item) {
		return item;
	},
	broadcastAdd : function (parentid, id, pos) {
		applicationSocket.emit(getAppCategoryAddPublish(parentid), { appcategoryid: id, position: pos });
	},
	broadcastChange : function (id, item) {
		applicationSocket.emit('appcategory-change:' + id, { appcategory: item });
	},
	broadcastMove : function (id, parentid, item, position) {
		applicationSocket.emit('appcategory-delete:' + id, {});
		applicationSocket.emit(getAppCategoryAddPublish(parentid), {appcategoryid: id, appcategory: item, position: position});
	},
	broadcastDelete : function (id) {
		applicationSocket.emit('appcategory-delete:' + id, {});
	},
	backend : core.appcategorys
});

function getAppCategoryAddPublish(id) {
	if (typeof id == 'undefined' || ! id) {
		return "appcategory-add";
	} else {
		return "appcategory-add:" + id;
	}
}

module.exports.eachApplication = function (id, callback) {
	var self = this;
	core.appcategorys.getApplications(id, function (applicationids) {
		applicationids.forEach(function (applicationid) {
			self.get(applicationid, function (application) {
				callback(applicationid, application);
			});
		});
	});
}
