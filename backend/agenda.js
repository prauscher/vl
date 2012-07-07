exports.getRootSlideID = function (callback) {
	core.agenda.getRootSlideID(function (rootslideid) {
		if (callback) {
			callback(rootslideid);
		}
	});
}

exports.setRootSlideID = function (rootslideid, callbackSuccess) {
	core.agenda.setRootSlideID(rootslideid, function () {
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.getRootSlide = function (callback) {
	exports.getRootSlideID(function (rootslideid) {
		exports.get(rootslideid, function (rootslide) {
			callback(rootslideid, rootslide);
		});
	});
}

exports.exists = function (slideid, callback) {
	core.agenda.exists(slideid, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function(slideid, callback) {
	core.agenda.get(slideid, function (slide) {
		if (callback) {
			callback(slide);
		}
	});
}

exports.eachChildren = function(slideid, callback) {
	core.agenda.getChildren(slideid, function(subslideids) {
		subslideids.forEach(function (subslideid) {
			exports.get(subslideid, function (subslide) {
				callback(subslideid, subslide);
			});
		});
	});
}

function appendSlide(slideid, slide, callbackSuccess) {
	core.agenda.save(slideid, slide, function() {
		core.agenda.addChildren(slide.parentid, slideid, function (pos) {
			agendaSocket.emit('slide-add:' + slide.parentid, { slideid : slideid, position : pos });
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.add = function(slideid, slide, callbackSuccess) {
	if (! slide.parentid) {
		exports.getRootSlide(function (rootslideid, rootslide) {
			if (rootslide == null) {
				exports.setRootSlideID(slideid);
				exports.save(slideid, slide, function() {
					agendaSocket.emit('slide-add', { slideid : slideid });

					if (callbackSuccess) {
						callbackSuccess();
					}
				});
			} else {
				slide.parentid = rootslideid;
				appendSlide(slideid, slide, callbackSuccess);
			}
		});
	} else {
		appendSlide(slideid, slide, callbackSuccess);
	}
}

exports.save = function(slideid, slide, callbackSuccess) {
	core.agenda.save(slideid, slide, function () {
		agendaSocket.emit('slide-change:' + slideid, { slide : slide });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function(slideid, parentid, position, callbackSuccess) {
	exports.get(slideid, function (slide) {
		core.agenda.move(slideid, slide.parentid, parentid, position, function () {
			slide.parentid = parentid;
			core.agenda.save(slideid, slide, function() {
				agendaSocket.emit('slide-delete:' + slideid, {});
				agendaSocket.emit('slide-add:' + slide.parentid, {slideid : slideid, slide: slide, position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.delete = function(slideid, callbackSuccess) {
	core.agenda.delete(slideid, function () {
		agendaSocket.emit('slide-delete:' + slideid, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
