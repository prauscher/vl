// vim:noet:ts=4:sw=4:

$(function() {
	var socket = io.connect('/projectors');

	var projectors = {};
	var list = ko.observableArray();
	ko.applyBindings({ projectors: list }, $("#projectors table tbody").get(0));

	socket.on('reset', function() {
		list.removeAll();
	});

	function Projector(obj) {
		this.id = obj.id;
		this.name = ko.observable(obj.name);
		this.color = ko.observable(obj.color);
		this.isVisible = ko.observable(obj.isVisible);

		this.hide = function() {
			socket.emit('update', {id: this.id, data: {isVisible: false}});
		}

		this.show = function() {
			socket.emit('update', {id: this.id, data: {isVisible: true}});
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
});
