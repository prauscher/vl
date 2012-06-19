vl
==

Parallelentwicklung zu http://github.com/prauscher/versammlungsleiter

Install
-------

First, install [nodejs](http://nodejs.org/) and [redis](http://redis.io/)

	git clone git://github.com/Waldteufel/vl.git
	cd vl
	npm install

Running
-------

After successfully installing node, redis and projects dependencies, you can start the Beamer-Interface using

	node viewer.js

and pointing your Browser to the given Location. Do not kill node, as the server will not daemonize atm.
For running the Administration-Interface, you can run

	node admin.js

and go ahead just like the Beamer-Interface
