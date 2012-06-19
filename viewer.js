/**
 * Module dependencies.
 */

var routes = require('./routes'),
    app = require('./app.js');

// Routes

app.get('/', function (req, res) {
	res.render('clientOverview');
});

app.listen(3000, function(){
	console.log("Express server listening on http://localhost:%d/ in mode %s", app.address().port, app.settings.env);
});
