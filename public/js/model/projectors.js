// vim:noet:ts=4:sw=4:

model.register('projectors', function() {
	var socket = io.connect('/projectors');

	model.projectors = {
		byID: {},
		defaultID: ko.observable(null),
		list: ko.observableArray()
	};

	var ProjectorModel = function(props) {
		this.id = props.id;
		this.name = ko.observable(props.name);
		this.color = ko.observable(props.color);
		this.isVisible = ko.observable(props.isVisible);
		this.isDefault = ko.computed(function() {
			return this.id == model.projectors.defaultID();
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

	model.projectors.save = function(id, data) {
		if (id)
			socket.emit('update', { id: id, data: data });
		else
			socket.emit('create', data);
	}

	model.projectors.remove = function(id) {
		socket.emit('remove', id);
	}


	// bind to signals from server

	socket.on('reset', function() {
		model.projectors.byID = {};
		model.projectors.defaultID(null);
		model.projectors.list.removeAll();
	});

	socket.on('create', function(props) {
		var obj = new ProjectorModel(props);
		model.projectors.byID[obj.id] = obj;
		model.projectors.list.push(obj);
	});

	socket.on('update', function(diff) {
		var obj = model.projectors.byID[diff.id];
		for (key in diff.data)
			obj[key](diff.data[key]);
	});

	socket.on('remove', function(id) {
		model.projectors.list.remove(model.projectors.byID[id]);
		delete model.projectors.byID[id];
	});

	socket.on('setdefault', function(id) {
		model.projectors.defaultID(id);
	});
});
