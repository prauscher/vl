// vim:noet:ts=4:sw=4:

var socket = io.of('/projectors');

model.Projector.subscribe('create', function(ev) {
	socket.emit('create', ev.target.properties);
});

model.Projector.subscribe('update', function(ev) {
	var diff = { id: ev.target.id, data: {} };
	ev.target.diff.forEach(function(elem) {
		diff.data[elem.key] = elem.after;
	});
	socket.emit('update', diff);
});

model.Projector.subscribe('remove', function(ev) {
	socket.emit('delete', ev.target.id);
});

function playbackCreate(modelClass, client) {
	modelClass.find(function(err, ids) {
		ids.forEach(function(id) {
			modelClass.load(id, function() {
				client.emit('create', this.allProperties());
			});
		});
	});
}

socket.on('connection', function(client) {
	client.emit('reset');
	playbackCreate(model.Projector, client);

	client.on('create', function(data) {
		var obj = new model.Projector();
		for (key in data)
			obj.p(key, data[key]);
		obj.save();
	});

	client.on('update', function(diff) {
		model.Projector.load(diff.id, function() {
			for (key in diff.data)
				this.p(key, diff.data[key]);
			this.save();
		});
	});
});
