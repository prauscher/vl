exports.getRootSlideID = function (callback) {
	db.getRootSlideID(function (rootid) {
		if (callback) {
			callback(rootid);
		}
	});
}

exports.setRootSlideID = function (rootid, callbackSuccess) {
	db.setRootSlideID(rootid, function () {
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.getRootSlide = function (callback) {
	exports.getRootSlideID(function (rootid) {
		exports.get(rootid, function (rootitem) {
			callback(rootid, rootitem);
		});
	});
}

function sanitize(item) {
	return item;
}
var db = core.agenda;

exports.exists = function (id, callback) {
	db.exists(id, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function (id, callback) {
	db.get(id, function (item) {
		if (callback) {
			callback(sanitize(item));
		}
	});
}

exports.eachChildren = function (id, callback) {
	db.getChildren(id, function (subids) {
		subids.forEach(function (subid) {
			exports.get(subid, function (subitem) {
				callback(subid, sanitize(subitem));
			});
		});
	});
}

function appendSlide(id, item, callbackSuccess) {
	db.save(id, item, function () {
		db.addChildren(item.parentid, id, function (pos) {
			agendaSocket.emit('slide-add:' + item.parentid, { slideid : id, position : pos });
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.add = function (id, item, callbackSuccess) {
	if (! item.parentid) {
		exports.getRootSlide(function (rootid, rootitem) {
			if (rootitem == null) {
				exports.setRootSlideID(id);
				exports.save(id, item, function () {
					agendaSocket.emit('slide-add', { slideid : id });

					if (callbackSuccess) {
						callbackSuccess();
					}
				});
			} else {
				item.parentid = rootid;
				appendSlide(id, item, callbackSuccess);
			}
		});
	} else {
		appendSlide(id, item, callbackSuccess);
	}
}

exports.save = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		agendaSocket.emit('slide-change:' + id, { slide : item });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function (id, parentid, position, callbackSuccess) {
	exports.get(id, function (item) {
		db.move(id, item.parentid, parentid, position, function () {
			item.parentid = parentid;
			db.save(id, item, function () {
				agendaSocket.emit('slide-delete:' + id, {});
				agendaSocket.emit('slide-add:' + item.parentid, {slideid : id, slide: item, position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.delete = function (id, callbackSuccess) {
	db.delete(id, function () {
		agendaSocket.emit('slide-delete:' + id, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
