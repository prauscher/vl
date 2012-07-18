// vim:noet:sw=8:

var config = require("./config.js"),
    Webserver = require('./webserver.js');

var app = new Webserver({
	start: '/admin'
});

app.listen(config);
