$(function () {
	$("#new-flash").click(function () {
		$("#flash-options #select-beamers").empty();
		for (var beamerid in beamers) {
			$("#flash-options #select-beamers").append($("<img>")
				.addClass("select-beamer")
				.addClass("select-beamer-" + beamerid)
				.addClass("active")
				.css("background-color", beamers[beamerid].color)
				.click(function () {
					$(this).toggleClass("active", ! $(this).hasClass("active"));
				}) );
		}

		$("#flash-options #text").val("");
		$("#flash-options #type option").removeAttr("selected");
		$("#flash-options #timeout").val("30");

		$("#flash-options #save-flash").unbind("click").click(function () {
			var flash = { text : $("#flash-options #text").val(), type : $("#flash-options #type option:selected").val(), timeout : $("#flash-options #timeout").val() };
			for (var beamerid in beamers) {
				if ($("#flash-options #select-beamers .select-beamer-" + beamerid).hasClass("active")) {
					$.ajax({
						type: 'POST',
						url: '/beamer/' + beamerid + '/flash',
						data: { flash: flash },
						success: function() {
							$("#flash-options").modal('hide');
						}
					});
				}
			}
		});

		$("#flash-options").modal();
	});
});
