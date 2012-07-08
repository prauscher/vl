var socketio = require('socket.io');

exports.listen = function (app) {
	var io = socketio.listen(app);

	io.configure(function() {
		io.set('store', backend.socketIoStore);
	});

	io.registerBeamer = function () {
		return io.of("/beamers").on("connection", function (socket) {
			socket.on('registerdefaultbeamer', function (data) {
				backend.beamer.getDefault(function (beamerid) {
					socket.emit('beamer-set-default', {beamerid: beamerid});
				});
			});

			socket.on('registerbeamers', function (data) {
				backend.beamer.getAll(function (beamerid, beamer) {
					socket.emit('beamer-add', {beamerid: beamerid, beamer: beamer});
				});
			});

			socket.on('registerbeamer', function (data) {
				// Initialize Beamerstate
				backend.beamer.get(data.beamerid, function (beamer) {
					if (beamer == null) {
						socket.emit('err:beamer-not-found:' + data.beamerid, {});
					} else {
						socket.emit('beamer-change:' + data.beamerid, {beamer : beamer});
					}
				});

				backend.beamer.getTimers(data.beamerid, function (timerid, timer) {
					socket.emit('beamer-showtimer:' + data.beamerid, { timerid : timerid, timer : timer });
				});
			});
		});
	}

	io.registerTimers = function () {
		return io.of("/timers").on("connection", function (socket) {
			socket.on('registertimers', function (data) {
				backend.timers.getAll(function (timerid, timer) {
					socket.emit('timer-add', {timerid: timerid, timer: timer});
				});
			});
		});
	}

	io.registerAgenda = function () {
		return io.of("/agenda").on("connection", function (socket) {
			socket.on('registeragenda', function (data) {
				// client may ask for children
				var position = 0;
				backend.agenda.eachChildren(null, function(slideid, slide) {
					socket.emit('slide-add', {slideid: slideid, position: position++});
				});
			});

			socket.on('registerslide', function (data) {
				backend.agenda.get(data.slideid, function (slide) {
					if (slide == null) {
						socket.emit('err:slide-not-found:' + data.slideid, {});
					} else {
						socket.emit('slide-change:' + data.slideid, { slide: slide });
					}
				});

				if (data.sendChildren) {
					// Send children
					var position = 0;
					backend.agenda.eachChildren(data.slideid, function(subslideid, subslide) {
						socket.emit('slide-add:' + data.slideid, {slideid: subslideid, position: position++});
					});
				}
			});
		});
	}

	io.registerApplications = function () {
		return io.of("/applications").on("connection", function (socket) {
			socket.on('registerappcategorys', function (data) {
				// client may ask for children
				var position = 0;
				backend.appcategorys.eachChildren(null, function(appcategoryid, appcategory) {
					socket.emit('appcategory-add', {appcategoryid: appcategoryid, position: position++});
				});
			});

			socket.on('registerappcategory', function (data) {
				backend.appcategorys.get(data.appcategoryid, function (appcategory) {
					if (appcategory == null) {
						socket.emit('err:appcategory-not-found:' + data.appcategoryid, {});
					} else {
						socket.emit('appcategory-change:' + data.appcategoryid, { appcategory: appcategory });
					}
				});

				// Send children
				var position = 0;
				backend.appcategorys.eachChildren(data.appcategoryid, function (appcategoryid, appcategory) {
					socket.emit('appcategory-add:' + data.appcategoryid, { appcategoryid: appcategoryid, position: position++ });
				});

				// Send applications
				var applicationPosition = 0;
				backend.appcategorys.eachApplication(data.appcategoryid, function (applicationid, application) {
					socket.emit('application-add:' + data.appcategoryid, { applicationid: applicationid, position: applicationPosition++ });
				});
			});

			socket.on('registerapplication', function (data) {
				backend.applications.get(data.applicationid, function (application) {
					if (application == null) {
						socket.emit('err:application-not-found:' + data.applicationid, {});
					} else {
						socket.emit('application-change:' + data.applicationid, { application : application });
					}
				});
			});
		});
	}

	io.registerPollsites = function () {
		return io.of("/pollsites").on("connection", function (socket) {
			socket.on('registerpollsites', function (data) {
				backend.pollsites.getAll(function (pollsiteid, pollsite) {
					socket.emit('pollsite-add', {pollsiteid: pollsiteid, pollsite: pollsite});
				});
			});
		});
	}

	return io;
}
