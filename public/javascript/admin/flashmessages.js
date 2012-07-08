$(function () {
	$("#new-flash").click(function () {
		$("#flash-options #select-projectors").selectProjector({
			prefix : "Anzeigen auf ",
			defaultActive : true,
			clickProjector : function (projectorid) {
				this.toggleActive(projectorid, !this.isActive(projectorid));
			}
		});

		$("#flash-options #text").val("");
		$("#flash-options #type option").removeAttr("selected");
		$("#flash-options #timeout").val(formatTime(30));

		$("#flash-options #save-flash").unbind("click").click(function () {
			var flash = {
				text : $("#flash-options #text").val(),
				type : $("#flash-options #type").val(),
				timeout : parseTime($("#flash-options #timeout").val())
			};

			apiClient.eachProjector(function (projectorid, projector) {
				if ($("#flash-options #select-projectors").selectProjector("isActive", projectorid)) {
					apiClient.flashProjector(projectorid, flash, function () {
						$("#flash-options").modal('hide');
					});
				}
			});
		});

		$("#flash-options").modal();
	});
});
