exports.add = function(beamerid, beamer, callbackSuccess) {
	db.publish('beamer-add', JSON.stringify({ beamerid : beamerid, beamer : beamer }));
	exports.save(beamerid, beamer, callbackSuccess);
}

exports.save = function(beamerid, beamer, callbackSuccess) {
	db.hmset('beamer:' + beamerid, beamer, function(err) {
		db.hgetall('slides:' + beamer.currentslideid, function (err, currentslide) {
			db.publish('beamer-change:' + beamerid, JSON.stringify({ beamer : beamer, currentslide : currentslide }));
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.delete = function(beamerid, callbackSuccess) {
	
}

exports.flash = function(beamerid, flash, callbackSuccess) {
	db.publish('beamer-flash:' + beamerid, JSON.stringify({ flash : flash }));
	if (callbackSuccess) {
		callbackSuccess();
	}
}
