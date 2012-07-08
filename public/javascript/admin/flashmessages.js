$(function () {
	$("#new-flash").click(function () {
		$("#flash-options #select-projectors").empty();
		apiClient.eachProjector(function (projectorid, projector) {
			generateSelectProjectorButton(projectorid, {
				create : function (selectProjectorButton) {
					$("#flash-options #select-projectors").append(selectProjectorButton.addClass("active"));
				},
				click : function () {
					$(this).toggleClass("active", ! $(this).hasClass("active"));
				}
			});
		});

		$("#flash-options #text").val("");
		$("#flash-options #type option").removeAttr("selected");
		$("#flash-options #timeout").val(formatTime(30));

		$("#flash-options form").unbind("submit").submit(function () {
			$("#flash-options #save-flash").click();
		});
		$("#flash-options #save-flash").unbind("click").click(function () {
			var flash = { text : $("#flash-options #text").val(), type : $("#flash-options #type option:selected").val(), timeout : parseTime($("#flash-options #timeout").val()) };
			apiClient.eachProjector(function (projectorid, projector) {
				if ($("#flash-options #select-projectors .select-projector-" + projectorid).hasClass("active")) {
					apiClient.flashProjector(projectorid, flash, function () {
						$("#flash-options").modal('hide');
					});
				}
			});
		});

		$("#flash-options").modal();
	});
});
