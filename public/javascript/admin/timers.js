// vim:noet:sw=8:

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
		$("#timers tbody").sortedList("get", timerid).find(".color")
			.css('background-color', timer.color);
		$("#timers tbody").sortedList("get", timerid).find(".title")
			.text(timer.title || "Unbenannt")
			.toggleClass("untitled", !timer.title)
			.css("cursor", "pointer")
			.unbind("click")
			.click(function () {
				showTimerOptions(timerid, timer);
			});
		$("#timers tbody").sortedList("get", timerid).find(".current")
			.text(formatTime(timer.current));
		$("#timers tbody").sortedList("get", timerid).find(".value")
			.text(formatTime(timer.value));

		$("#timers tbody").sortedList("get", timerid).find(".start")
			.toggle(timer.running != 'true')
			.unbind("click")
			.click(function () {
				apiClient.startTimer(timerid, timer);
			});
		$("#timers tbody").sortedList("get", timerid).find(".pause")
			.toggle(timer.running == 'true')
			.unbind("click")
			.click(function () {
				apiClient.pauseTimer(timerid, timer);
			});
		$("#timers tbody").sortedList("get", timerid).find(".stop")
			.unbind("click")
			.click(function () {
				apiClient.stopTimer(timerid, timer);
			});
	});

	apiClient.on("countdownTimer", function (timerid, currentValue) {
		$("#timers tbody").sortedList("get", timerid).find(".current")
			.text(formatTime(currentValue));
	});

	apiClient.on("initTimer", function (timerid, timer) {
		$("#timers tbody").sortedList("add", timerid, $("<tr>")
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
				.append($("<i>").addClass("stop").addClass("icon-stop").attr("title", "Stoppen"))
				.append($("<a>").append($("<i>").addClass("icon-play-circle").attr("title", "Anzeigen")).attr("href", "/timer#timer:" + timerid)) ) );
	});

	apiClient.on("deleteTimer", function (timerid) {
		$("#timers tbody").sortedList("remove", timerid);
	});

	apiClient.on("showTimerProjector", function (projectorid, timerid, timer) {
		$("#timers tbody").sortedList("get", timerid).find(".select-projectors")
			.selectProjector("toggleActive", [ projectorid, true ]);
	});

	apiClient.on("hideTimerProjector", function (projectorid, timerid, timer) {
		$("#timers tbody").sortedList("get", timerid).find(".select-projectors")
			.selectProjector("toggleActive", [ projectorid, false ]);
	});

	$("#timers tbody").sortedList();

	$("#new-timer").click(function () {
		showTimerOptions(null, {
			running : false,
			value : 0,
			startValue : 0,
			color : generateColor()
		});
	});
});
