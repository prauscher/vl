// vim:noet:ts=4:sw=4:



model.Projector.subscribe('create', function(ev) {
	io.of('/projectors').emit('create', ev.target.properties);
});

model.Projector.subscribe('update', function(ev) {
	io.of('/projectors').emit('update', ev.target.properties);
});

model.Projector.subscribe('remove', function(ev) {
	io.of('/projectors').emit('delete', ev.target.id);
});

function playbackCreate(modelClass, socket) {
	modelClass.find(function(err, ids) {
		ids.forEach(function(id) {
			modelClass.load(id, function() {
				socket.emit('create', this.allProperties());
			});
		});
	});
}

app.post('/projectors', function(req, res) {
	var obj = new model.Projector();
	for (key in obj.properties) obj.p(key, req.body[key]);
	obj.save(function() {
		res.set('Location', '/projector/' + this.id);
		res.send(200);
	});
});

app.put('/projector/:id', function(req, res) {
	model.Projector.load(req.params.id, function() {
		for (key in this.properties) this.p(key, req.body[key]);
		this.save(function() {
			res.send(200);
		});
	});
});

app.delete('/projector/:id', function(req, res) {
	model.Projector.remove(req.params.id, function() {
		res.send(200);
	});
});

io.of('/projectors').on('connection', function(socket) {
	playbackCreate(model.Projector, socket);
});
