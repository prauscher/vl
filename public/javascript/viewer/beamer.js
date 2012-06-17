var beamerClient = {};

beamerClient.update = function (beamerid, beamer, currentslide) {
	if (currentSlideID != null) {
		socket.unregisterSlide(currentSlideID);
	}
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
	};
	socket.registerSlide(beamer.currentslideid, setBeamerContent);
	setBeamerContent(beamer.currentslideid, currentslide);

	$("#identify").css("background-color", beamer.color).text(beamerid);
}

beamerClient.flash = function (beamerid, flash) {
	var flashContainer = $("<div>");
	flashContainer.addClass("flash-" + flash.type);
	flashContainer.text(flash.text);

	window.setTimeout(function () {
		flashContainer.hide();
	}, data.flash.timeout * 1000);

	// Insert hidden to allow effects
	flashContainer.hide();
	$("#flashs").append(flashContainer);

	flashContainer.show();					
}

beamerClient.showTimer = function (beamerid, timerid, timer) {
	var timerClient = new TimerClient({
		update : function (timerid, timer) {
			$("#timers #timer-" + timerid).css("background-color", timer.color);
		},
		countdown : function (timerid, currentValue) {
			$("#timers #timer-" + timerid).text(timerClient.formatTime(currentValue));
		}
	});
	socket.registerTimer(timerid, timerClient);
	if ($("#timers #timer-" + timerid).length < 1) {
		var timerContainer = $("<div>").attr("id", "timer-" + timerid);
		timerContainer.addClass("timer");

		// Insert hidden to allow effects
		timerContainer.hide();
		$("#timers").append(timerContainer);
	}
	timerClient.update(timerid, timer);
	$("#timers #timer-" + timerid).show();
}

beamerClient.hideTimer = function (beamerid, timerid, timer) {
	socket.unregisterTimer(timerid);
	$("#timers #timer-" + timerid).hide();
}
