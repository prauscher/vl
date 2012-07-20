// vim:noet:sw=8:

module.exports = function (options) {
	this.backend = options.backend;
	this.broadcastAdd = options.broadcastAdd;
	this.broadcastChange = options.broadcastChange;
	this.broadcastMove = options.broadcastMove;
	this.broadcastDelete = options.broadcastDelete;
	this.sanitize = options.sanitize;
}

module.exports.prototype.exists = function (id, callback) {
	this.backend.exists(id, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

module.exports.prototype.get = function (id, callback) {
	var self = this;
	this.backend.get(id, function (item) {
		if (callback) {
			callback(self.sanitize(item));
		}
	});
}

module.exports.prototype.eachChildren = function (id, callback) {
	var self = this;
	this.backend.getChildren(id, function (subids) {
		subids.forEach(function (subid) {
			self.get(subid, function (subitem) {
				callback(subid, subitem);
			});
		});
	});
}

module.exports.prototype.add = function (id, item, callbackSuccess) {
	var self = this;
	this.backend.save(id, item, function () {
		self.backend.addChildren(item.parentid, id, function (pos) {
			self.broadcastAdd(item.parentid, id, pos);

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

module.exports.prototype.save = function (id, item, callbackSuccess) {
	var self = this;
	this.backend.save(id, item, function () {
		self.broadcastChange(id, self.sanitize(item));

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

module.exports.prototype.move = function (id, parentid, position, callbackSuccess) {
	var self = this;
	this.get(id, function (item) {
		self.backend.move(id, item.parentid, parentid, position, function () {
			if (parentid) {
				item.parentid = parentid;
			} else {
				delete item.parentid;
			}
			self.backend.save(id, item, function () {
				self.broadcastMove(id, item.parentid, self.sanitize(item), position);

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

module.exports.prototype.delete = function (id, callbackSuccess) {
	var self = this;
	this.backend.delete(id, function () {
		self.broadcastDelete(id);

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
