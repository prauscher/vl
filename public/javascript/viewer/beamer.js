function setBeamerContent (slideid, slide) {
	$('#title').text(slide.title);

	$('#content .content-text').hide();
	$('#content .content-html').hide();
	$('#content .content-agenda').hide();
	if (slide.type == 'text') {
		$('#content .content-text').show();
		$('#content .content-text').text(slide.text);
	} else if (slide.type == 'html') {
		$('#content .content-html').show();
		$('#content .content-html').html(slide.html);
	} else if (slide.type == 'agenda') {
		$('#content .content-agenda').show();
	}	
}

function setViewerData(scroll, zoom) {
	$("#content").animate({
		fontSize: zoom + "em",
		marginTop: scroll + "em"
	}, 500);
}

$(function () {
	apiClient.on("initSlide", function (slideid, slide, position) {
		if (slide.parentid == currentSlideID) {
			var item = $("<li>").attr("id", "agenda-" + slideid);
			if (position == 0) {
				$("#content .content-agenda").prepend(item);
			} else {
				$("#content .content-agenda>li:eq(" + (position - 1) + ")").after(item);
			}
		}
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		if (slideid == currentSlideID) {
			setBeamerContent(slideid, slide);
		} else {
			$("#content .content-agenda #agenda-" + slideid).text(slide.title).toggleClass("done", slide.isdone == "true").toggle(slide.hidden != "true");
		}
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#content .content-agenda #agenda-" + slideid).remove();
	});

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
		currentSlideID = beamer.currentslideid;
		$('#content .content-agenda').empty();
		apiClient.registerSlide(currentSlideID);

		setBeamerContent(currentSlideID, currentslide);
		setViewerData(beamer.scroll, beamer.zoom);

		$("#identify").css("background-color", beamer.color).text(beamer.title);
	});

	apiClient.on("deleteBeamer", function (beamerid) {
		alert("SRSLY");
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
