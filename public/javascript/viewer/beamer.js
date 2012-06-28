var currentSlideID = null;
var currentApplicationID = null;
var beamerScroll = 0;
var beamerZoom = 1;

function setBeamerContent (slideid, slide) {
	if (currentApplicationID != null) {
		apiClient.unregisterApplication(currentApplicationID);
		currentApplicationID = null;
	}
	if (slide.type == 'application') {
		currentApplicationID = slide.applicationid;
		apiClient.registerApplication(currentApplicationID);
	}

	$('#title').text(slide.title);

	$('#content .content-text').hide();
	$('#content .content-html').hide();
	$('#content .content-agenda').hide();
	$('#content .content-application').hide();
	if (slide.type == 'text') {
		$('#content .content-text').show();
		$('#content .content-text').text(slide.text);
	} else if (slide.type == 'html') {
		$('#content .content-html').show();
		$('#content .content-html').html(slide.html);
	} else if (slide.type == 'agenda') {
		$('#content .content-agenda').show();
	} else if (slide.type == 'application') {
		$('#content .content-application').show();
	}	
}

function setViewerData(scroll, zoom) {
	beamerScroll = scroll;
	beamerZoom = zoom;

	$("#content").animate({
		fontSize: zoom + "em",
		marginTop: scroll + "em"
	}, 500);
}

function setCurrentSlide(slideid) {
	if (currentSlideID != null) {
		apiClient.unregisterSlide(currentSlideID);
		currentSlideID = null;
	}
	currentSlideID = slideid;
	$('#content .content-agenda').empty();

	apiClient.registerSlide(currentSlideID, 1);
}

function updateCurrentTime() {
	var now = new Date();
	var hours = now.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var minutes = now.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	$("#currentTime").text(hours + ":" + minutes);
}

function showError(message, notes) {
	$("#error .message").text(message);
	$("#error .notes").text(notes);
	$("#error").show();
	$("#waiting").hide();
}

$(function () {
	apiClient.on('updateSlide', function (slideid, slide) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:slideNotFound', function (slideid) {
		showError("Die Folie wurde nicht gefunden");
	});
	apiClient.on('updateBeamer', function (beamerid, beamer) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:beamerNotFound', function (beamerid) {
		showError("Der Beamer wurde nicht gefunden");
	});

	apiClient.on("initSlide", function (slideid, parentid, position) {
		if (parentid == currentSlideID) {
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
		$("#identify").fadeIn(100);
		window.setTimeout(function () {
			$("#identify").fadeOut(300);
		}, timeout * 1000);
	});

	apiClient.on("updateBeamer", function (beamerid, beamer, currentslide) {
		if (currentslide == null) {
			showError("Der Beamer ist nicht konfiguriert", "Es ist keine Folie für den Beamer konfiguriert");
		} else {
			setCurrentSlide(beamer.currentslideid);
			setBeamerContent(currentSlideID, currentslide);
		}
		setViewerData(beamer.scroll, beamer.zoom);

		$("#identify").css("background-color", beamer.color).text(beamer.title);
	});

	apiClient.on("deleteBeamer", function (beamerid) {
		showError("Der Beamer wurde gelöscht");
	});

	apiClient.on("flashBeamer", function (beamerid, flash) {
		var flashContainer = $("<div>")
			.addClass("flash-" + flash.type)
			.text(flash.text);

		window.setTimeout(function () {
			flashContainer.slideUp(300);
		}, flash.timeout * 1000);

		// Insert hidden to allow effects
		flashContainer.hide();
		$("#flashs").append(flashContainer);

		flashContainer.show(300);
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

	apiClient.on("updateApplication", function (applicationid, application) {
		$(".applicationid").text(applicationid);
		$(".application-text").text(application.text);
		$(".application-argumentation").text(application.argumentation);
		$(".application-submitter").text(application.submitter);
		$(".application-status *").hide();
		$(".application-status .status-" + application.status).show();
	});

	$("#beamer-reset").click(function() {
		setViewerData(0, 1);
	});
	$("#beamer-zoom-in").click(function () {
		setViewerData(beamerScroll, beamerZoom * 1.1);
	});
	$("#beamer-zoom-out").click(function () {
		setViewerData(beamerScroll, beamerZoom / 1.1);
	});
	$("#beamer-scroll-up").click(function () {
		setViewerData(beamerScroll - 1, beamerZoom);
	});
	$("#beamer-scroll-down").click(function () {
		setViewerData(beamerScroll + 1, beamerZoom);
	});

	updateCurrentTime();
	window.setInterval(updateCurrentTime ,1000);
});
