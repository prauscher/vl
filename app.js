// vim:noet:ts=4:sw=4:

var express = require('express'),
	socketio = require('socket.io'),
	http = require('http'),
	fs = require('fs');

if (process.argv.length < 3) {
	console.error("Please provide the config file name as a command line parameter!");
	process.exit(1);
}
global.config = JSON.parse(fs.readFileSync(process.argv[2]));

global.app = express();
var server = http.createServer(app);
global.io = socketio.listen(server);
global.model = require('./model.js'); // after global.config exists

// Configuration
io.set('store', new socketio.RedisStore({
	redisPub: config.redis,
	redisSub: config.redis,
	redisClient: config.redis
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout : false });

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'dsfwe113r2r32f43', key: 'express.sid' }));
app.use(app.router);
app.use(express.static(__dirname + '/public', { maxAge: 24*60*60*1000 }));

if (app.get('env') == 'development') {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
}

if (app.get('env') == 'production') {
	app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.redirect(config.home);
});

// generate client javascript
var minify = require('node-minify').minify;

new minify({
	type: 'no-compress',
	fileIn: [
		'public/libs/jquery-1.8.0.min.js',
		'public/libs/jquery-ui-1.8.23.custom.min.js',
		'public/libs/jquery.cookie.js',
		'public/libs/jquery.mjs.nestedSortable.js',
		'public/libs/jquery-miniColors/jquery.miniColors.min.js',
	],
	fileOut: 'public/min/libs.js',
	callback: function(err) { if (err) console.log(err); }
});

// start server
server.on('listening', function() {
	if (process.getuid() == 0) {
		process.setgid(self.config.setgid);
		process.setuid(self.config.setuid);
	}

	console.log("Express server listening on http://%s:%d/ in mode %s", config.host || "localhost", config.port, app.get('env'));
});

model.connect(function() {
	config.controllers.forEach(function(name) {
		require('./controllers/' + name);
	});

	server.listen(config.port, config.host);
});
