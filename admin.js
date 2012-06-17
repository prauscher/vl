/**
 * Module dependencies.
 */

var routes = require('./routes'),
    app = require('./app.js');

// Routes

app.get('/', routes.admin.index);

app.post('/beamer-identify', routes.admin.beamer.identify);

app.post('/agenda/:slideid/delete', routes.admin.agenda.delete);
app.put('/agenda/:slideid/save', routes.admin.agenda.save);

app.put('/beamer/:beamerid/save', routes.admin.beamer.save);
app.post('/beamer/:beamerid/showtimer', routes.admin.beamer.showtimer);
app.post('/beamer/:beamerid/hidetimer', routes.admin.beamer.hidetimer);
app.post('/beamer/:beamerid/flash', routes.admin.beamer.flash);

app.put('/timers/:timerid/save', routes.admin.timers.save);
app.post('/timers/:timerid/delete', routes.admin.timers.delete);
app.post('/timers/:timerid/start', routes.admin.timers.start);
app.post('/timers/:timerid/pause', routes.admin.timers.pause);
app.post('/timers/:timerid/stop', routes.admin.timers.stop);

app.listen(3001, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
