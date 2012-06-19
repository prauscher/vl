/**
 * Module dependencies.
 */

var routes = require('./routes'),
    app = require('./app.js');

// Routes

app.get('/', function (req, res) {
	res.render('admin');
});

app.post('/beamer-identify', routes.beamer.identify);

app.put('/agenda/:slideid/save', routes.agenda.save);
app.post('/agenda/:slideid/delete', routes.agenda.delete);

app.put('/beamer/:beamerid/save', routes.beamer.save);
app.post('/beamer/:beamerid/delete', routes.beamer.delete);
app.post('/beamer/:beamerid/showtimer', routes.beamer.showTimer);
app.post('/beamer/:beamerid/hidetimer', routes.beamer.hideTimer);
app.post('/beamer/:beamerid/flash', routes.beamer.flash);

app.put('/timers/:timerid/save', routes.timers.save);
app.post('/timers/:timerid/delete', routes.timers.delete);
app.post('/timers/:timerid/start', routes.timers.start);
app.post('/timers/:timerid/pause', routes.timers.pause);
app.post('/timers/:timerid/stop', routes.timers.stop);

app.listen(3001, function(){
	console.log("Express server listening on http://localhost:%d/ in mode %s", app.address().port, app.settings.env);
});
