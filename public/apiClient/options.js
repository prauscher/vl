// vim:noet:sw=8:

APIClient.prototype.options = {};

APIClient.prototype.getOption = function (optionid, callback) {
	callback(this.options[optionid]);
}

APIClient.prototype.registerOption = function (optionid) {
	var self = this;
	this.listen("/ballots", 'err:option-not-found:' + optionid, function (data) {
		console.log("[APIClient] Option not found: " + optionid);
		self.callCallback("error:optionNotFound", [ optionid ]);
	});
	this.listen("/ballots", 'option-change:' + optionid, function (data) {
		self.options[optionid] = data.option;

		self.callCallback("updateOption", [ optionid, data.option ]);
	});
	this.listen("/ballots", 'option-delete:' + optionid, function (data) {
		self.unregisterOption(optionid);
		self.callCallback("deleteOption", [ optionid ]);
		for (var ballotid in self.ballot_options) {
			var index = $.inArray(self.ballot_options[ballotid], optionid);
			if (index > -1)
				self.ballot_options[ballotid].splice(index, 1);
		}
	});
	this.emit("/ballots", 'registeroption', { optionid: optionid });
}

APIClient.prototype.unregisterOption = function (optionid) {
	this.unlisten("/ballots", 'err:option-not-found:' + optionid);
	this.unlisten("/ballots", 'option-change:' + optionid);
	this.unlisten("/ballots", 'option-delete:' + optionid);
}

APIClient.prototype.saveOption = function (optionid, option, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/options/' + optionid + '/save',
		data: { option: option },
		success: callbackSuccess
	});
}
