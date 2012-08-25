vl
==

Install
-------

First, install [nodejs](http://nodejs.org/) and [redis](http://redis.io/)

	git clone git://github.com/Waldteufel/vl.git
	cd vl
	npm install

Configuration
-------------

The configuration files are JSON and may contain the following options:

* host

  if specified, the application will only listen on this host. By default it will listen on any host.
* port *required*

  on which port the application will listen. for ports below 1024 you will need to run as root on unix-hosts. See setuid in those cases
* setuid

  setuid and setgid specify the user- and groupid, which the process will switch to when running as root. This is important when you want the daemon to listen on ports below 1024 on unix-hosts.
* setgid

  see setuid
* modules

  which modules the application should load. Currently, there are "admin" and "viewer"

Running
-------

After you successfully installed node, redis and the required npm modules, set up the configuration for admin and viewer
instances. Both config files are JSON and allow the same options, examples are provided the "config" directory.

You can now start the projector interface using

	node app.js config/viewer.conf

Just point your Browser to the given location. Do not kill node, as the server will not daemonize atm.

To run the admin interface use

	node app.js config/admin.conf

and go ahead just like with the projector interface.

<!--
vim:noet:ts=4:sw=4:tw=72:
-->
