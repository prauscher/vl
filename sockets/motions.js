// vim:noet:sw=8:

module.exports = function (socket) {
	socket.on('registermotionclasses', function (data) {
		// client may ask for children
		var position = 0;
		backend.motionclasses.eachChildren(null, function(motionclassid, motionclass) {
			socket.emit('motionclass-add', {motionclassid: motionclassid, position: position++});
		});
	});

	socket.on('registermotionclass', function (data) {
		backend.motionclasses.get(data.motionclassid, function (motionclass) {
			if (motionclass == null) {
				socket.emit('err:motionclass-not-found:' + data.motionclassid, {});
			} else {
				socket.emit('motionclass-change:' + data.motionclassid, { motionclass: motionclass });
			}
		});

		// Send children
		var position = 0;
		backend.motionclasses.eachChildren(data.motionclassid, function (motionclassid, motionclass) {
			socket.emit('motionclass-add:' + data.motionclassid, { motionclassid: motionclassid, position: position++ });
		});

		// Send motions
		var motionPosition = 0;
		backend.motionclasses.eachMotion(data.motionclassid, function (motionid, motion) {
			socket.emit('motion-add:' + data.motionclassid, { motionid: motionid, position: motionPosition++ });
		});
	});

	socket.on('registermotion', function (data) {
		backend.motions.get(data.motionid, function (motion) {
			if (motion == null) {
				socket.emit('err:motion-not-found:' + data.motionid, {});
			} else {
				socket.emit('motion-change:' + data.motionid, { motion : motion });
			}
		});
	});

	socket.on('registermotionballots', function (data) {
		backend.motions.eachBallot(data.motionid, function (ballotid) {
			socket.emit('motion-addballot:' + data.motionid, { ballotid : ballotid });
		});
	});
}
