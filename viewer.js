/**
 * Module dependencies.
 */

var fs = require('fs'),
    routes = require('./routes'),
    app = require('./app.js');

// Routes

app.get('/', function (req, res) {
	res.render('clientOverview');
});

if (process.argv.length < 3) {
	console.error("Please provide the config file name as a command line parameter!");
	process.exit(1);
}

var config = JSON.parse(fs.readFileSync(process.argv[2]));

app.listen(config.port, config.host, function(){
        if (process.getuid() == 0) {
		process.setgid(config.setgid);
		process.setuid(config.setuid);
        }
	console.log("Express server listening on http://localhost:%d/ in mode %s", app.address().port, app.settings.env);
});
