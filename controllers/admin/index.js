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

require('./projectors.js');
