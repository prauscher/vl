/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    redis = require('redis'),
    db = require('./db.js');

var app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

// Configuration

app.configure(function() {
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
   app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/agenda', routes.agenda);
app.get('/beamer', routes.beamer);

app.put('/current', routes.current);
app.post('/reset', routes.reset);

io.sockets.on('connection', function(socket) {
   // inform about current agenda item
   db.get('current', function(err, current) {
      db.hget("top:" + current, 'title', function(err, title) {
         socket.emit('current', { id: current, title: title });
      });
   });

   // inform about time allotted 
   db.get('lastreset', function(err, lastreset) {
      // calculate timer offset on server so that clock differences
      // between server and client don't affect the timer
      var timer = Math.floor((new Date().getTime() - new Date(lastreset).getTime()) / 1000);
      socket.emit('timer', timer);
   });

   var listener = redis.createClient();
   listener.subscribe('current');
   listener.subscribe('lastreset');

   listener.on('message', function(channel, message) {
      if (channel == "current") {
         var current = message;
         db.hget("top:" + current, 'title', function(err, title) {
            socket.emit('current', { id: current, title: title });
         });
      } else if (channel == 'lastreset') {
         var timer = Math.floor((new Date().getTime() - new Date(message).getTime()) / 1000);
         socket.emit('timer', timer);
      }
   });
});

app.listen(3000, function(){
   console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
