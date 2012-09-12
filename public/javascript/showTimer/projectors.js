// vim:noet:sw=8:

var currentProjectorID = null;

function configureProjector(projectorid) {
	if (projectorid != currentProjectorID) {
		if (currentProjectorID != null) {
			apiClient.unregisterIdentifyProjector();
			apiClient.unregisterProjector(projectorid);
			currentProjectorID = null;
		}
		if (projectorid) {
			resetView();
			apiClient.registerIdentifyProjector();
			apiClient.registerProjector(projectorid);
			currentProjectorID = projectorid;
		}
	}
}

$(function () {
	apiClient.on('error:projectorNotFound', function (projectorid) {
		if (projectorid == currentProjectorID) {
			showError("Der Projektor wurde nicht gefunden");
		}
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		if (projectorid == currentProjectorID) {
			showView();
			$("#identify").css("background-color", projector.color).text(projector.title);
		}
	});

	apiClient.on("deleteProjector", function (projectorid) {
		if (projectorid == currentProjectorID) {
			showError("Der Projektor wurde gelöscht");
		}
	});

	apiClient.on("identifyProjector", function (timeout) {
		$("#identify").fadeIn(100);
		window.setTimeout(function () {
			$("#identify").fadeOut(300);
		}, timeout * 1000);
	});

	apiClient.on("flashProjector", function (projectorid, flash) {
		if (projectorid == currentProjectorID) {
			var flashContainer = $("<div>")
				.addClass("flash-" + flash.type)
				.text(flash.text);

			window.setTimeout(function () {
				flashContainer.slideUp(300);
			}, flash.timeout * 1000);

			// Insert hidden to allow effects
			flashContainer.hide();
			$("#flashs").append(flashContainer);

			flashContainer.show(300);
		}
	});

	apiClient.on("showTimerProjector", function (projectorid, timerid, timer) {
		if (projectorid == currentProjectorID) {
			addTimer(timerid, timer);
			apiClient.registerTimer(timerid);
		}
	});

	apiClient.on("hideTimerProjector", function (projectorid, timerid, timer) {
		if (projectorid == currentProjectorID) {
			apiClient.unregisterTimer(timerid);
			removeTimer(timerid);
		}
	});
});
