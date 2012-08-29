// vim:noet:ts=4:sw=4:

var minify = require('node-minify').minify;

new minify({
	type: 'no-compress',
	fileIn: [
		'public/js/admin/index.js',
		'public/js/admin/projectors.js'
	],
	fileOut: 'public/min/admin.js',
	callback: function(err) { if (err) console.log(err); }
});

app.get('/admin', function(req, res) {
	res.render('admin');
});

function propagateModel(modelClass, socket) {
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

require('./projectors.js');
