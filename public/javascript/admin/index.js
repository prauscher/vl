// vim:noet:sw=8:

function generateID() {
	return Math.random().toString(36).substring(2);
}

function generateColor() {
	var rand = Math.random();
	var r, g, b;
	switch (Math.floor(Math.random() * 6)) {
		case 0: r = 1;		g = rand;	b = 0; break;
		case 1: r = rand;	g = 1;		b = 0; break;
		case 2: r = 0;		g = 1;		b = rand; break;
		case 3: r = 0;		g = rand;	b = 1; break;
		case 4: r = rand;	g = 0;		b = 1; break;
		case 5: r = 1;		g = 0;		b = rand; break;
	}

	function formatByte(x) {
		return ("0" + Math.floor(255.0 * x).toString(16)).substr(-2);
	}

	return "#" + formatByte(r) + formatByte(g) + formatByte(b);
}

function generateShowOptionsModal(options) {
	return function (id, item) {
		$(options.modal).find(".delete").toggle(options.deleteCallback && id != null);

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
				} else if (field.type == "select") {
					object.val(item[field.property]).attr("data-initValue", item[field.property]);
				} else if (field.type == "checkbox") {
					object.prop("checked", item[field.property] && item[field.property] == "true");
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
					} else if (field.type == "select") {
						item[field.property] = object.val();
					} else if (field.type == "checkbox") {
						item[field.property] = object.is(":checked");
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

		$(options.modal)
			.on("show", function () {
				options.openModal && options.openModal(options.modal, id, item);
			})
			.on("hide", function () {
				options.closeModal && options.closeModal(options.modal, id, item);
			})
			.modal();
	}
}

$(function () {
	$(".modal").hide()
		.on("hide", function() {
			$(this).find(".miniColors").miniColors("destroy");
		})
		.on("shown", function() {
			$(this).find("input:enabled, textarea:enabled").first().focus();
		});
	$(".modal form").unbind("submit").submit(function() {
		$(this).parent().find(".save").click();
	});

	apiClient.on('lostConnection', function() {
		var modal = $("<div>").addClass("modal hide").append(
			$("<div>").addClass("modal-header").append(
				$("<button>").addClass("close").attr("data-dismiss", "modal").html("&times;"),
				$("<h3>").text("Verbindung abgerissen") ),
			$("<div>").addClass("modal-body").append(
				$("<p>").text("Die Netzwerkverbindung ist abgerissen. Um eine Beschädigung der Daten zu vermeiden wird hier abgebrochen.") ),
			$("<div>").addClass("modal-footer").append(
				$("<a>").addClass("btn").attr("data-dismiss","modal").text("Verstecken") ) );
		$("body").append(modal);
		modal.modal();
	});

	apiClient.on('reconnect', function () {
		location.reload();
	});
});
