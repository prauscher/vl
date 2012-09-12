// vim:noet:sw=8:

var currentTimerID = null;

function configureTimer(timerid) {
	if (timerid != currentTimerID) {
		if (currentTimerID != null) {
			apiClient.unregisterTimers();
			currentTimerID = null;
		}
		if (timerid) {
			resetView();
			apiClient.registerTimers();
			currentTimerID = timerid;
		}
	}
}

$(function () {
	apiClient.on('error:timerNotFound', function (timerid) {
		if (timerid == currentTimerID) {
			showError("Der Timer wurde nicht gefunden");
		}
	});

	apiClient.on("initTimer", function (timerid, timer) {
		if (timerid == currentTimerID) {
			addTimer(timerid, timer);
			showView();
		}
	});

	apiClient.on("deleteTimer", function (timerid) {
		if (timerid == currentTimerID) {
			showError("Der Timer wurde gelöscht");
		}
	});

	apiClient.on("updateTimer", function (timerid, timer) {
		$("#timers #timer-" + timerid).css("background-color", timer.color);
	});

	apiClient.on("countdownTimer", function (timerid, currentValue) {
		$("#timers #timer-" + timerid)
			.text(formatTime(currentValue))
			.toggleClass("timer-expired", currentValue == 0);
	});

	apiClient.on("deleteTimer", function(timerid) {
		$("#timers #timer-" + timerid).remove();
	});
});
