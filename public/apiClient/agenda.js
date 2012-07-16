// vim:noet:sw=8:

APIClient.prototype.slides = {};
APIClient.prototype.slideChildren = {};

APIClient.prototype.eachSlide = function (callback) {
	for (var slideid in this.slides) {
		callback(slideid, this.slides[slideid]);
	}
}

APIClient.prototype.getSlide = function (slideid, callback) {
	callback(this.slides[slideid]);
}

APIClient.prototype.registerAgenda = function () {
	var self = this;
	this.listen("/agenda", 'slide-add', function (data) {
		self.slides[data.slideid] = null;

		self.registerSlide(data.slideid);
		self.callCallback("initSlide", [ data.slideid, null, data.position ] );
	});
	this.emit("/agenda", 'registeragenda', {});
}

APIClient.prototype.registerSlide = function (slideid, maxdepth) {
	var self = this;
	self.slideChildren[slideid] = [];
	this.listen("/agenda", 'err:slide-not-found:' + slideid, function (data) {
		console.log("[APIClient] Slide not found: " + slideid);
		self.callCallback("error:slideNotFound", [ slideid ]);
	});
	this.listen("/agenda", 'slide-add:' + slideid, function (data) {
		self.slides[data.slideid] = null;
		self.slideChildren[slideid].push(data.slideid);

		if (typeof maxdepth == 'undefined') {
			self.registerSlide(data.slideid);
		} else if (maxdepth > 0) {
			self.registerSlide(data.slideid, maxdepth - 1);
		}
		self.callCallback("initSlide", [ data.slideid, slideid, data.position ] );
	});
	this.listen("/agenda", 'slide-change:' + slideid, function (data) {
		self.slides[slideid] = data.slide;

		self.callCallback("updateSlide", [ slideid, data.slide ] );
	});
	this.listen("/agenda", 'slide-delete:' + slideid, function (data) {
		var parentid = self.slides[slideid].parentid;
		if (parentid) {
			delete self.slides[slideid];
			self.slideChildren[parentid].slice(self.slideChildren[parentid].indexOf(slideid), 1);
		}

		self.unregisterSlide(slideid);
		self.callCallback("deleteSlide", [ slideid ] );
	});

	this.emit("/agenda", 'registerslide', { slideid: slideid, sendChildren: (typeof maxdepth == 'undefined' || maxdepth > 0) });
}

APIClient.prototype.unregisterSlide = function (slideid) {
	this.unlisten("/agenda", 'err:slide-not-found:' + slideid);
	this.unlisten("/agenda", 'slide-add:' + slideid);
	this.unlisten("/agenda", 'slide-change:' + slideid);
	this.unlisten("/agenda", 'slide-delete:' + slideid);

	for (var i in this.slideChildren[slideid]) {
		this.unregisterSlide(this.slideChildren[slideid][i]);
	}
}

APIClient.prototype.saveSlide = function(slideid, slide, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/agenda/' + slideid + '/save',
		data: { slide : slide },
		success: callbackSuccess
	});
}

APIClient.prototype.moveSlide = function (slideid, parentid, position, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/agenda/' + slideid + '/move',
		data: { parentid: parentid, position: position },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteSlide = function(slideid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/agenda/' + slideid + '/delete',
		success: callbackSuccess
	});
}
