module.exports.propagateModel = function(modelClass, socket) {
	modelClass.subscribe('create', function(ev) {
		socket.emit('create', ev.target.properties);
	});

	modelClass.subscribe('update', function(ev) {
		var diff = { id: ev.target.id, data: {} };
		ev.target.diff.forEach(function(elem) {
			diff.data[elem.key] = elem.after;
		});
		socket.emit('update', diff);
	});

	modelClass.subscribe('remove', function(ev) {
		socket.emit('remove', ev.target.id);
	});
}
