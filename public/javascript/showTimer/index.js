// vim:noet:sw=8:

function resetView() {
	if ($("#error").is(":visible")) {
		$("#error").hide();
		$("#waiting").show();
	}
	$("#timers").empty();
}

function showView() {
	$("#error").hide();
	$("#waiting").fadeOut(300);
}

function addTimer(timerid, timer) {
	if ($("#timers #timer-" + timerid).length < 1) {
		var timerContainer = $("<div>").attr("id", "timer-" + timerid).addClass("timer");
		timerContainer.append($("<div>").addClass("label"), $("<div>").addClass("timer"));

		// Insert hidden to allow effects
		timerContainer.hide();
		$("#timers").append(timerContainer);
	}
	apiClient.callCallback("updateTimer", [ timerid, timer ] );
	$("#timers #timer-" + timerid).show();
}

function removeTimer(timerid) {
	$("#timers #timer-" + timerid).remove();
}

function showError(message, notes) {
	$("#error .message").text(message);
	$("#error .notes").text(notes);
	$("#error").show();
	$("#waiting").hide();
}

$(function () {
	resetView();
	$("#identify").hide();
});
