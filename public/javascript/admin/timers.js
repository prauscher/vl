$(function () {
	var showTimerOptions = generateShowOptionsModal({
		modal : "#timers #timer-options",
		fields : [
			{ property : "title", field : "#title", type : "text" },
			{ property : "color", field : "#color", type : "color" },
			{ property : "value", field : "#value", type : "time" }
		],
		fillItem : function (modal, id, item) {
			if (! item.startedValue) {
				item.startedValue = item.value;
			}
		},
		saveCallback : apiClient.saveTimer,
		deleteCallback : apiClient.deleteTimer
	});

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
		$("#timers #timers").append($("<tr>").attr("id", "timer-" + timerid)
			.append($("<td>").append($("<img>").addClass('color').attr("src", "/images/empty.gif")))
			.append($("<td>").addClass("title"))
			.append($("<td>").append($("<span>").addClass("current")).append(" / ").append($("<span>").addClass("value")))
			.append($("<td>").addClass("select-projectors").selectProjector({
				prefix : "Anzeigen auf ",
				clickProjector : function (projectorid, isActive) {
					if (isActive) {
						apiClient.hideTimerProjector(projectorid, timerid);
					} else {
						apiClient.showTimerProjector(projectorid, timerid);
					}
				}
			}))
			.append($("<td>")
				.append($("<i>").addClass("start").addClass("icon-play").attr("title", "Starten"))
				.append($("<i>").addClass("pause").addClass("icon-pause").attr("title", "Pausieren"))
				.append($("<i>").addClass("stop").addClass("icon-stop").attr("title", "Stoppen")) ) );
	});

	apiClient.on("deleteTimer", function (timerid) {
		$("#timer-" + timerid).remove();
	});

	apiClient.on("showTimerProjector", function (projectorid, timerid, timer) {
		$("#timer-" + timerid + " .select-projectors").selectProjector("toggleActive", [ projectorid, true ]);
	});

	apiClient.on("hideTimerProjector", function (projectorid, timerid, timer) {
		$("#timer-" + timerid + " .select-projectors").selectProjector("toggleActive", [ projectorid, false ]);
	});

	$("#new-timer").click(function () {
		showTimerOptions(null, {
			running : false,
			value : 0,
			startValue : 0,
			color : generateColor()
		});
	});
});
