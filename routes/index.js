var db = require('../db.js');

exports.index = function(req, res) {
   res.render('index', { title: 'Express' });
};

exports.agenda = function(req, res) {
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

exports.beamer = function(req, res) {
   res.render('beamer');
};

exports.current = function(req, res) {
   db.set('current', req.body.id, function(err) {
      db.publish('current', req.body.id, function(err) {
         res.send(200);
      });
   });
};

exports.reset = function(req, res) {
   db.set('lastreset', new Date(), function(err) {
      db.publish('lastreset', new Date(), function(err) {
         res.send(200);
      });
   });
};
