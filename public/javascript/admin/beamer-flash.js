$(function () {
	$("#new-flash").click(function () {
		$("#flash-options #select-beamers").empty();
		apiClient.eachBeamer(function (beamerid, beamer) {
			generateSelectBeamerButton(beamerid, {
				create : function (selectBeamerButton) {
					$("#flash-options #select-beamers").append(selectBeamerButton.addClass("active"));
				},
				click : function () {
					$(this).toggleClass("active", ! $(this).hasClass("active"));
				}
			});
		});

		$("#flash-options #text").val("");
		$("#flash-options #type option").removeAttr("selected");
		$("#flash-options #timeout").val("30");

		$("#flash-options #save-flash").unbind("click").click(function () {
			var flash = { text : $("#flash-options #text").val(), type : $("#flash-options #type option:selected").val(), timeout : $("#flash-options #timeout").val() };
			apiClient.eachBeamer(function (beamerid, beamer) {
				if ($("#flash-options #select-beamers .select-beamer-" + beamerid).hasClass("active")) {
					apiClient.flashBeamer(beamerid, flash, function () {
						$("#flash-options").modal('hide');
					});
				}
			});
		});

		$("#flash-options").modal();
	});
});
