var setBeamerContent = function (slideid, slide) {
	currentSlideID = slideid;
	$('#title').text(slide.title);
	if (slide.type == 'text') {
		$('#content').text(slide.text);
	} else if (slide.type == 'html') {
		$('#content').html(slide.html);
	} else if (slide.type == 'agenda') {
		$('#content').text("OHAI!");
	} else {
		$('#content').text("");
	}	
}

$(function () {
	apiClient.on("updateSlide", setBeamerContent);

	apiClient.on("identifyBeamer", function (timeout) {
		$("#identify").show();
		window.setTimeout(function () {
			$("#identify").hide();
		}, timeout * 1000);
	});

	apiClient.on("updateBeamer", function (beamerid, beamer, currentslide) {
		if (currentSlideID != null) {
			apiClient.unregisterSlide(currentSlideID);
		}
		apiClient.registerSlide(beamer.currentslideid);
		setBeamerContent(beamer.currentslideid, currentslide);

		$("#identify").css("background-color", beamer.color).text(beamerid);
	});

	apiClient.on("flashBeamer", function (beamerid, flash) {
		var flashContainer = $("<div>")
			.addClass("flash-" + flash.type)
			.text(flash.text);

		window.setTimeout(function () {
			flashContainer.hide();
		}, flash.timeout * 1000);

		// Insert hidden to allow effects
		flashContainer.hide();
		$("#flashs").append(flashContainer);

		flashContainer.show();					
	});

	apiClient.on("updateTimer", function (timerid, timer) {
		$("#timers #timer-" + timerid).css("background-color", timer.color);
	});

	apiClient.on("countdownTimer", function (timerid, currentValue) {
		$("#timers #timer-" + timerid).text(formatTime(currentValue));
	});

	apiClient.on("deleteTimer", function(timerid) {
		$("#timers #timer-" + timerid).remove();
	});

	apiClient.on("showTimerBeamer", function (beamerid, timerid, timer) {
		this.registerTimer(timerid);
		if ($("#timers #timer-" + timerid).length < 1) {
			var timerContainer = $("<div>").attr("id", "timer-" + timerid);
			timerContainer.addClass("timer");

			// Insert hidden to allow effects
			timerContainer.hide();
			$("#timers").append(timerContainer);
		}
		this.callCallback("updateTimer", [ timerid, timer ] );
		$("#timers #timer-" + timerid).show();
	});

	apiClient.on("hideTimerBeamer", function (beamerid, timerid, timer) {
		this.unregisterTimer(timerid);
		$("#timers #timer-" + timerid).hide();
	});
});
