module.exports = function (options) {
	this.sanitize = options.sanitize;
	this.broadcastAdd = options.broadcastAdd;
	this.broadcastChange = options.broadcastChange;
	this.broadcastDelete = options.broadcastDelete;
	this.backend = options.backend;
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

module.exports.prototype.getAll = function (callback) {
	var self = this;
	this.backend.getAll(function (ids) {
		ids.forEach(function (id, n) {
			self.get(id, function (item) {
				callback(id, item);
			});
		});
	});
}

module.exports.prototype.add = function (id, item, callbackSuccess) {
	var self = this;
	this.backend.save(id, item, function () {
		self.backend.add(id, function () {
			self.broadcastAdd(id, self.sanitize(item));

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

module.exports.prototype.delete = function (id, callbackSuccess) {
	var self = this;
	this.backend.delete(id, function () {
		self.broadcastDelete(id);

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
