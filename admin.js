/**
 * Module dependencies.
 */

var routes = require('./routes'),
    app = require('./app.js');

// Routes

app.get('/', routes.admin.index);

app.post('/agenda/:slideid/delete', routes.admin.agenda.delete);
app.put('/agenda/:slideid/save', routes.admin.agenda.save);
app.post('/agenda/:slideid/isdone', routes.admin.agenda.isdone);
app.post('/agenda/:slideid/hidden', routes.admin.agenda.hidden);

app.post('/beamer/:beamerid/current_slide', routes.admin.beamer.current_slide);

app.listen(3001, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
