exports.index = function(req, res) {
   res.render('index');
};

exports.get_agenda = function(req, res) {
   db.lrange('agenda', 0, -1, function(err, item_ids) {
      var items = new Array(item_ids.length);

      item_ids.forEach(function(id, n) {
         db.hget('top:'+id, 'title', function(err, title) {
            items[n] = { id: id, title: title };
            if (n == items.length - 1)
            res.render('agenda', { items: items });
         });
      });
   });
};

exports.put_agenda_item = function(req, res) {
   db.hset('top:' + req.params.id, 'title', req.body.title, function(err, title) {
      db.rpush('agenda', req.params.id, function(err) {
         res.send(200);
      });
   });
};

exports.beamer = function(req, res) {
   res.render('beamer');
};

exports.current = function(req, res) {
   var current = req.body.id;
   db.set('current', current, function(err) {
      db.hget("top:" + current, 'title', function(err, title) {
         io.sockets.emit('current', { id: current, title: title });
         res.send(200);
      });
   });
};

exports.reset = function(req, res) {
   var now = new Date();
   db.set('lastreset', now, function(err) {
      io.sockets.emit('timer', 0);
      res.send(200);
   });
};
