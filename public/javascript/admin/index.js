function generateID() {
	return Math.random().toString(36).substring(2);
}

function generateShowOptionsModal(options) {
	return function (id, item) {
		$(options.modal).find(".delete").toggle(options.deleteCallback && id != null);

		if (id == null && options.initItem) {
			options.initItem(id, item);
		}

		if (options.idfield) {
			if (id == null) {
				$(options.modal).find(options.idfield).val("").prop("disabled", false);
			} else {
				$(options.modal).find(options.idfield).val(id).prop("disabled", true);
			}
		} else if (id == null) {
			id = generateID();
		}

		if (options.fields) {
			for (var i in options.fields) {
				var field = options.fields[i];
				var object = $(options.modal).find(field.field);
				if (field.type == "text") {
					object.val(item[field.property]);
				} else if (field.type == "time") {
					object.val(formatTime(item[field.property]));
				} else if (field.type == "color") {
					object.val(item[field.property]).miniColors();
				}
			}
		}
		options.fillModal && options.fillModal(options.modal, id, item);

		$(options.modal).find(".save").unbind("click").click(function () {
			if (id == null && options.idfield) {
				id = $(options.modal).find(options.idfield).val();
			}

			if (options.fields) {
				for (var i in options.fields) {
					var field = options.fields[i];
					var object = $(options.modal).find(field.field);
					if (field.type == "text") {
						item[field.property] = object.val();
					} else if (field.type == "time") {
						item[field.property] = parseTime(object.val());
					} else if (field.type == "color") {
						item[field.property] = object.val();
					}
				}
			}
			options.fillItem && options.fillItem(options.modal, id, item);

			options.saveCallback(id, item, function() {
				$(options.modal).modal('hide');
			});
		});

		$(options.modal).find(".delete").unbind("click").click(function () {
			options.deleteCallback(id, function() {
				$(options.modal).modal('hide');
			});
		});

		$(options.modal).modal();
	}
}

$(function () {
	$(".modal").hide()
		.on("hide", function() {
			$(this).find(".miniColors").miniColors("destroy");
		})
		.on("shown", function() {
			$(this).find("input:enabled:first").focus();
		});
	$(".modal form").unbind("submit").submit(function() {
		$(this).parent().find(".save").click();
	});
});
