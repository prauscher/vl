// vim:noet:ts=4:sw=4:

app.put('/projector/:id', function(req, res) {
	db.hset('projector:' + req.params.id, 'title', 'ladida');
	db.lpush('projectors', req.params.id);
	res.send(201);
});

io.of('/projectors').on('connection', function(socket) {
	db.lrange('projectors', 0, -1, function(err, result) {
		result.forEach(function(id) {
			db.hgetall('projector:' + id, function(err, obj) {
				obj.id = id;
				socket.emit('add', obj);
			});
		});
	});
});
