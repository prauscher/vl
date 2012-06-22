APIClient.prototype.slides = {};

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
	this.socketIo.on('slide-add', function (data) {
		if (! self.slides[data.slideid]) {
			self.slides[data.slideid] = data.slide;

			self.registerSlide(data.slideid);
			self.callCallback("initSlide", [ data.slideid, data.slide ] );
		}
		self.callCallback("updateSlide", [ data.slideid, data.slide ] );
	});
	this.socketIo.emit('registeragenda', {});
}

APIClient.prototype.registerSlide = function (slideid) {
	var self = this;
	this.socketIo.on('slide-add:' + slideid, function (data) {
		if (! self.slides[data.slideid]) {
			self.slides[data.slideid] = data.slide;

			self.registerSlide(data.slideid);
			self.callCallback("initSlide", [ data.slideid, data.slide, data.position ] );
		}
		self.callCallback("updateSlide", [ data.slideid, data.slide ] );
	});
	this.socketIo.on('slide-change:' + slideid, function (data) {
		self.slides[slideid] = data.slide;

		self.callCallback("updateSlide", [ slideid, data.slide ] );
	});
	this.socketIo.on('slide-delete:' + slideid, function (data) {
		delete self.slides[slideid];

		self.socketIo.removeAllListeners('slide-add:' + slideid);
		self.socketIo.removeAllListeners('slide-change:' + slideid);
		self.socketIo.removeAllListeners('slide-delete:' + slideid);

		self.callCallback("deleteSlide", [ slideid ] );
	});
	this.socketIo.emit('registerslide', { slideid: slideid });
}

APIClient.prototype.unregisterSlide = function (slideid) {
	this.socketIo.removeAllListeners('slide-change:' + slideid);
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
