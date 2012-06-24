function showTimerOptions(timerid, timer) {
	if (timerid == null) {
		timerid = Math.random().toString(36).replace(/[^a-zA-Z0-9]/,'').substring(0,7);
		timer.running = false;
		timer.startValue = 0;
		$("#timers #timer-options #delete-timer").hide();
	} else {
		$("#timers #timer-options #delete-timer").show();
	}

	$("#timers #timer-options #title").val(timer.title);
	// Call destroy to remove earlier timer-option-dialogs
	$("#timers #timer-options #color").val(timer.color).miniColors("destroy").miniColors();
	$("#timers #timer-options #value").val(formatTime(timer.value));

	$("#timers #timer-options #save-timer").unbind("click").click(function () {
		timer.title = $("#timers #timer-options #title").val();
		timer.color = $("#timers #timer-options #color").val();

		timer.value = 0;
		var parts = $("#timers #timer-options #value").val().split(":");
		for (var i = 0; i < parts.length; i++) {
			timer.value += parts[i] * Math.pow(60, parts.length - i - 1);
		}

		if (!timer.startedValue) {
			timer.startedValue = timer.value;
		}
		apiClient.saveTimer(timerid, timer, function () {
			$("#timers #timer-options").modal('hide');
		});
	});
	$("#timers #timer-options #delete-timer").unbind("click").click(function () {
		apiClient.deleteTimer(timerid, function () {
			$("#timers #timer-options").modal('hide');
		});
	});

	$("#timers #timer-options").modal();
}

$(function () {
	apiClient.on("updateTimer", function (timerid, timer) {
		$("#timers #timer-" + timerid + " .color").css('background-color', timer.color);
		$("#timers #timer-" + timerid + " .title").text(timer.title);
		$("#timers #timer-" + timerid + " .current").text(formatTime(timer.current));
		$("#timers #timer-" + timerid + " .value").text(formatTime(timer.value));

		$("#timers #timer-" + timerid + " .start").toggle(timer.running != 'true').unbind("click").click(function () {
			apiClient.startTimer(timerid, timer);
		});
		$("#timers #timer-" + timerid + " .pause").toggle(timer.running == 'true').unbind("click").click(function () {
			apiClient.pauseTimer(timerid, timer);
		});
		$("#timers #timer-" + timerid + " .stop").unbind("click").click(function () {
			apiClient.stopTimer(timerid, timer);
		});

		$("#timers #timer-" + timerid + " .title").unbind("click").click(function () {
			showTimerOptions(timerid, timer);
		});
	});

	apiClient.on("countdownTimer", function (timerid, currentValue) {
		$("#timers #timer-" + timerid + " .current").text(formatTime(currentValue));
	});

	apiClient.on("initTimer", function (timerid, timer) {
		var selectBeamer = $("<td>").addClass("select-beamers");
		apiClient.eachBeamer(function (beamerid, beamer) {
			generateSelectBeamerTimerButton(beamerid, timerid, function (selectBeamerButton) {
				selectBeamer.append(selectBeamerButton);
			});
		});

		$("#timers #timers").append($("<tr>").attr("id", "timer-" + timerid)
			.append($("<td>").append($("<img>").addClass('color')))
			.append($("<td>").addClass("title"))
			.append($("<td>").append($("<span>").addClass("current")).append(" / ").append($("<span>").addClass("value")))
			.append(selectBeamer)
			.append($("<td>")
				.append($("<i>").addClass("start").addClass("icon-play").attr("title", "Starten"))
				.append($("<i>").addClass("pause").addClass("icon-pause").attr("title", "Pausieren"))
				.append($("<i>").addClass("stop").addClass("icon-stop").attr("title", "Stoppen")) ) );
	});

	apiClient.on("deleteTimer", function (timerid) {
		$("#timer-" + timerid).remove();
	});

	apiClient.on("initBeamer", function (beamerid, beamer) {
		apiClient.eachTimer(function (timerid, timer) {
			generateSelectBeamerTimerButton(beamerid, timerid, function (selectBeamerButton) {
				$("#timers #timer-" + timerid + " .select-beamers").append(selectBeamerButton);
			});
		});
	});

	$("#new-timer").click(function () {
		showTimerOptions(null, {});
	});
});
