// vim:noet:sw=8:

var currentProjectorID = null;

function configureProjector(projectorid) {
	if (projectorid != currentProjectorID) {
		if (currentProjectorID != null) {
			apiClient.unregisterIdentifyProjector();
			apiClient.unregisterProjector(projectorid);
			currentProjectorID = null;
		}
		configureSlide();
		if (projectorid) {
			resetView();
			$("#timers").empty();
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
			if (projector.currentslideid) {
				configureSlide(projector.currentslideid);
			} else {
				showError("Der Projektor ist nicht konfiguriert", "Es ist keine Folie für den Projektor konfiguriert");
			}
			setViewerData(projector.zoom, projector.scroll);
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

	apiClient.on("updateTimer", function (timerid, timer) {
		$("#timers #timer-" + timerid).css("background-color", timer.color);
	});

	apiClient.on("countdownTimer", function (timerid, currentValue) {
		$("#timers #timer-" + timerid)
			.text("⌛ " + formatTime(currentValue))
			.toggleClass("timer-expired", currentValue <= 10);
	});

	apiClient.on("deleteTimer", function(timerid) {
		$("#timers #timer-" + timerid).remove();
	});

	apiClient.on("showTimerProjector", function (projectorid, timerid, timer) {
		if (projectorid == currentProjectorID) {
			this.registerTimer(timerid);
			if ($("#timers #timer-" + timerid).length < 1) {
				var timerContainer = $("<div>").attr("id", "timer-" + timerid).addClass("timer");

				// Insert hidden to allow effects
				timerContainer.hide();
				$("#timers").append(timerContainer);
			}
			this.callCallback("updateTimer", [ timerid, timer ] );
			$("#timers #timer-" + timerid).show();
		}
	});

	apiClient.on("hideTimerProjector", function (projectorid, timerid, timer) {
		if (projectorid == currentProjectorID) {
			this.unregisterTimer(timerid);
			$("#timers #timer-" + timerid).hide();
		}
	});
});
