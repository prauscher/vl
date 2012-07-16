// vim:noet:sw=8:

module.exports = function (options) {
	this.dbprefix = options.dbprefix;
	this.hooks = options.hooks || {};
}

module.exports.prototype.exists = function (id, callback) {
	db.exists(this.dbprefix + ':' + id, function (err, exists) {
		callback(exists);
	});
}

module.exports.prototype.get = function(id, callback) {
	db.hgetall(this.dbprefix + ':' + id, function(err, item) {
		callback(item);
	});
}

module.exports.prototype.getAll = function(callback) {
	db.smembers(this.dbprefix, function (err, ids) {
		callback(ids);
	});
}

module.exports.prototype.add = function(id, callbackSuccess) {
	var self = this;
	db.sadd(this.dbprefix, id, function () {
		if (self.hooks.add) {
			self.hooks.add(id);
		}
		callbackSuccess();
	});
}

module.exports.prototype.save = function(id, item, callbackSuccess) {
	var self = this;
	db.hmset(this.dbprefix + ':' + id, item, function (err) {
		if (self.hooks.save) {
			self.hooks.save(id, item);
		}
		callbackSuccess();
	});
}

module.exports.prototype.delete = function(id, callbackSuccess) {
	var self = this;
	db.srem(this.dbprefix, id, function (err) {
		db.del(self.dbprefix + ':' + id, function (err) {
			if (self.hooks.delete) {
				self.hooks.delete.apply(self, [ id ]);
			}
			callbackSuccess();
		});
	});
}
