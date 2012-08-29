// vim:noet:ts=4:sw=4:

$(function() {
	var socket = io.connect('/projectors');

	var projectors = {};
	var defaultID = ko.observable(null);
	var list = ko.observableArray();
	ko.applyBindings({ projectors: list }, $("#projectors table tbody").get(0));


	// projector model

	function ProjectorModel(props) {
		this.id = props.id;
		this.name = ko.observable(props.name);
		this.color = ko.observable(props.color);
		this.isVisible = ko.observable(props.isVisible);
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


	// "projector options" dialog model

	var dialogModel = {
		id: ko.observable(null),
		name: ko.observable(''),
		color: ko.observable(''),

		save: function() {
			var data = {
				name: this.name(),
				color: this.color()
			};

			if (this.id)
				socket.emit('update', { id: this.id(), data: data });
			else
				socket.emit('create', data);
			dialog.modal('hide');
		},
		remove: function() {
			socket.emit('remove', this.id());
			dialog.modal('hide');
		},
	};

	var dialog = $("#projector-options");
	ko.applyBindings(dialogModel, dialog.get(0));
	dialog.on('hidden', function() { console.log(dialogModel.color()); });

	// slightly hacky, depends on internal implementation of jquery-miniColors
	dialog.find('[name="color"]').data('change', dialogModel.color);


	// bind to html events

	$('#new-projector').click(function() {
		dialogModel.id(null);
		dialogModel.name('');
		dialogModel.color('');
		dialog.modal('show');
	});


	// bind to signals from server

	socket.on('reset', function() {
		projectors = {};
		defaultID(null);
		list.removeAll();
	});

	socket.on('create', function(props) {
		var obj = new ProjectorModel(props);
		projectors[obj.id] = obj;
		list.push(obj);
	});

	socket.on('update', function(diff) {
		for (key in diff.data)
			projectors[diff.id][key](diff.data[key]);
	});

	socket.on('remove', function(id) {
		list.remove(projectors[id]);
		delete projectors[id];
	});

	socket.on('setdefault', function(id) {
		defaultID(id);
	});
});
