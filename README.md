vl
==

Install
-------

First, install [nodejs](http://nodejs.org/) and [redis](http://redis.io/)

	git clone git://github.com/Waldteufel/vl.git
	cd vl
	npm install

As socket.io currently ships with an old version of the redis client library, please replace
node_modules/socket.io/node_modules/redis/lib/util.js with the following content:

	exports.util = require("util");

Running
-------

After you successfully installed node, redis and the required npm modules, set up the configuration for admin and viewer
instances. Both config files are JSON and allow the same options, examples are provided in admin.conf and viewer.conf.

You can now start the beamer interface using

	node viewer.js viewer.conf

Just point your Browser to the given location. Do not kill node, as the server will not daemonize atm.

To run the admin interface use

	node admin.js admin.conf

and go ahead just like with the beamer interface.
