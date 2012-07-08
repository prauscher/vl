function showTimerOptions(timerid, timer) {
	if (timerid == null) {
		timerid = generateID();
		timer.running = false;
		timer.value = 0;
		timer.startValue = 0;
		$("#timers #timer-options #delete-timer").hide();
	} else {
		$("#timers #timer-options #delete-timer").show();
	}

	$("#timers #timer-options #title").val(timer.title);
	$("#timers #timer-options #color").val(timer.color).miniColors();
	$("#timers #timer-options #value").val(formatTime(timer.value));

	$("#timers #timer-options form").unbind("submit").submit(function () {
		$("#timers #timer-options #save-timer").click();
	});
	$("#timers #timer-options #save-timer").unbind("click").click(function () {
		timer.title = $("#timers #timer-options #title").val();
		timer.color = $("#timers #timer-options #color").val();
		timer.value = parseTime($("#timers #timer-options #value").val());

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

	$("#timers #timer-options").on("shown", function() {
		$("#timers #timer-options #title").focus();
	});
	$("#timers #timer-options").modal();
}

$(function () {
	apiClient.on("updateTimer", function (timerid, timer) {
		$("#timers #timer-" + timerid + " .color").css('background-color', timer.color);
		$("#timers #timer-" + timerid + " .title").text(timer.title || "Unbenannt").toggleClass("untitled", !timer.title);
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

		$("#timers #timer-" + timerid + " .title").unbind("click").css("cursor", "pointer").click(function () {
			showTimerOptions(timerid, timer);
		});
	});

	apiClient.on("countdownTimer", function (timerid, currentValue) {
		$("#timers #timer-" + timerid + " .current").text(formatTime(currentValue));
	});

	apiClient.on("initTimer", function (timerid, timer) {
		var selectProjector = $("<td>").addClass("select-projectors");
		apiClient.eachProjector(function (projectorid, projector) {
			generateSelectProjectorTimerButton(projectorid, timerid, function (selectProjectorButton) {
				selectProjector.append(selectProjectorButton);
			});
		});

		$("#timers #timers").append($("<tr>").attr("id", "timer-" + timerid)
			.append($("<td>").append($("<img>").addClass('color').attr("src", "/images/empty.gif")))
			.append($("<td>").addClass("title"))
			.append($("<td>").append($("<span>").addClass("current")).append(" / ").append($("<span>").addClass("value")))
			.append(selectProjector)
			.append($("<td>")
				.append($("<i>").addClass("start").addClass("icon-play").attr("title", "Starten"))
				.append($("<i>").addClass("pause").addClass("icon-pause").attr("title", "Pausieren"))
				.append($("<i>").addClass("stop").addClass("icon-stop").attr("title", "Stoppen")) ) );
	});

	apiClient.on("deleteTimer", function (timerid) {
		$("#timer-" + timerid).remove();
	});

	apiClient.on("initProjector", function (projectorid, projector) {
		apiClient.eachTimer(function (timerid, timer) {
			generateSelectProjectorTimerButton(projectorid, timerid, function (selectProjectorButton) {
				$("#timers #timer-" + timerid + " .select-projectors").append(selectProjectorButton);
			});
		});
	});

	$("#new-timer").click(function () {
		showTimerOptions(null, {});
	});
});
