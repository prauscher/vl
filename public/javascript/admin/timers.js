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
	$("#timers #timer-options #color").val(timer.color);
	$("#timers #timer-options #value").val(timer.value);

	$("#timers #timer-options #save-timer").unbind("click");
	$("#timers #timer-options #save-timer").click(function () {
		timer.title = $("#timers #timer-options #title").val();
		timer.color = $("#timers #timer-options #color").val();
		timer.value = $("#timers #timer-options #value").val();
		saveTimer(timerid, timer, function () {
			$("#timers #timer-options").modal('hide');
		});
	});
	$("#timers #timer-options #delete-timer").unbind("click");
	$("#timers #timer-options #delete-timer").click(function () {
		deleteTimer(timerid, function () {
			$("#timers #timer-options").modal('hide');
		});
	});

	$("#timers #timer-options").modal();
}

var timerClient = new TimerClient({
	update : function (timerid, timer) {
		$("#timers #timer-" + timerid + " .color").css('background-color', timer.color);
		$("#timers #timer-" + timerid + " .title").text(timer.title);
		$("#timers #timer-" + timerid + " .current").text(timerClient.formatTime(timer.current));
		$("#timers #timer-" + timerid + " .value").text(timerClient.formatTime(timer.value));

		$("#timers #timer-" + timerid + " .start").toggle(timer.running != 'true').unbind("click").click(function () {
			$.ajax({
				type: 'POST',
				url: '/timers/' + timerid + '/start',
				data: { timer : timer }
			});
		});
		$("#timers #timer-" + timerid + " .pause").toggle(timer.running == 'true').unbind("click").click(function () {
			$.ajax({
				type: 'POST',
				url: '/timers/' + timerid + '/pause',
				data: { timer : timer }
			});
		});
		$("#timers #timer-" + timerid + " .stop").unbind("click").click(function () {
			$.ajax({
				type: 'POST',
				url: '/timers/' + timerid + '/stop',
				data: { timer : timer }
			});
		});

		$("#timers #timer-" + timerid + " .title").unbind("click").click(function () {
			showTimerOptions(timerid, timer);
		});
	},
	countdown : function (timerid, currentValue) {
		$("#timers #timer-" + timerid + " .current").text(timerClient.formatTime(currentValue));
	}
});

timerClient.init = function (timerid, timer) {
	if ($("#timer-" + timerid).length < 1) {
		timers[timerid] = timer;

		var selectBeamer = $("<td>");
		for (var beamerid in beamers) {
			selectBeamer.append(beamerClient.generateSelectBeamerTimerButton(beamerid, timerid));
		}

		var item = $("<tr>").attr("id", "timer-" + timerid);
		item.append($("<td>").append($("<img>").addClass('color')));
		item.append($("<td>").addClass("title"));
		item.append($("<td>").append($("<span>").addClass("current")).append(" / ").append($("<span>").addClass("value")));
		item.append(selectBeamer);
		item.append($("<td>")
			.append($("<i>").addClass("start").addClass("icon-play"))
			.append($("<i>").addClass("pause").addClass("icon-pause"))
			.append($("<i>").addClass("stop").addClass("icon-stop")));

		$("#timers #timers").append(item);
	}				
}

timerClient.delete = function (timerid) {
	$("#timer-" + timerid).remove();
}

$(function () {
	$("#new-timer").click(function () {
		showTimerOptions(null, {});
	});
});
