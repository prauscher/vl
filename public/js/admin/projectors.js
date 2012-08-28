// vim:noet:ts=4:sw=4:

$(function() {
	var socket = io.connect('/projectors');

	var projectors = {};
	var defaultID = ko.observable(null);
	var list = ko.observableArray();
	ko.applyBindings({ projectors: list }, $("#projectors table tbody").get(0));

	socket.on('reset', function() {
		projectors = {};
		list.removeAll();
		defaultID(null);
	});

	function Projector(obj) {
		this.id = obj.id;
		this.name = ko.observable(obj.name);
		this.color = ko.observable(obj.color);
		this.isVisible = ko.observable(obj.isVisible);
		this.isDefault = ko.computed(function() {
			return this.id == defaultID();
		}, this);

		this.hide = function() {
			socket.emit('update', {id: this.id, data: {isVisible: false}});
		}

		this.show = function() {
			socket.emit('update', {id: this.id, data: {isVisible: true}});
		}

		this.setDefault = function() {
			socket.emit('setdefault', this.id);
		}
	}

	$('#new-projector').click(function() {
		socket.emit('create', {name: 'ladida', color: 'pink', isVisible: false});
	});

	socket.on('create', function(props) {
		var obj = new Projector(props);
		projectors[obj.id] = obj;
		list.push(obj);
	});

	socket.on('update', function(diff) {
		for (key in diff.data)
			projectors[diff.id][key](diff.data[key]);
	});

	socket.on('delete', function(id) {
		list.remove(projectors[id]);
		delete projectors[id];
	});

	socket.on('setdefault', function(id) {
		defaultID(id);
	});
});
