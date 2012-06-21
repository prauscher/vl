vl
==

Install
-------

First, install [nodejs](http://nodejs.org/) and [redis](http://redis.io/)

	git clone git://github.com/Waldteufel/vl.git
	cd vl
	npm install

Running
-------

After you successfully installed node, redis and the required npm modules, you can start the beamer interface using

	node viewer.js

Just point your Browser to the given location. Do not kill node, as the server will not daemonize atm.

To run the admin interface use

	node admin.js

and go ahead just like with the beamer interface.