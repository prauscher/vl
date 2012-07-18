// vim:noet:sw=8:

var Webserver = require('./webserver.js');

var app = new Webserver({
	start: '/admin',
	isAllowed: function (perm, req) {
		return true;
	}
});
