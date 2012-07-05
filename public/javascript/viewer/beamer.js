var currentSlideID = null;
var currentApplicationID = null;
var beamerScroll = 0;
var beamerZoom = 1;

function configureBeamer(beamerid) {
	apiClient.registerIdentifyBeamer();
	apiClient.registerBeamer(beamerid);

	configureSlide();
}

function configureSlide(slideid) {
	if (currentSlideID != null) {
		apiClient.unregisterSlide(currentSlideID);
		currentSlideID = null;
	}
	$('#content .content-agenda').empty();
	configureApplication();
	if (slideid) {
		apiClient.registerSlide(slideid, 1);
		currentSlideID = slideid;
	}
}

function configureApplication(applicationid) {
	if (currentApplicationID != null) {
		apiClient.unregisterApplication(currentApplicationID);
		currentApplicationID = null;
	}
	if (applicationid) {
		apiClient.registerApplication(applicationid);
		currentApplicationID = applicationid;
	}
}

function clearView() {
	$('#content .content-text').hide();
	$('#content .content-html').hide();
	$('#content .content-agenda').hide();
	$('#content .content-application').hide();
}

function showView(type, options) {
	clearView();

	$('#title').text(options.title);

	if (type == "text") {
		$('#content .content-text').text(options.text).show();
	}
	if (type == "html") {
		$('#content .content-html').html(options.html).show();
	}
	if (type == "agenda") {
		$('#content .content-agenda').show();
	}
	if (type == "application") {
		$('#title').text(options.application.title);
		$(".applicationid").text(options.applicationid);
		$(".application-text").text(options.application.text);
		$(".application-argumentation").text(options.application.argumentation);
		$(".application-submitter").text(options.application.submitter);
		$(".application-status *").hide();
		$(".application-status .status-" + options.application.status).show();
		$('#content .content-application').show();
	}
}

function setViewerData(scroll, zoom) {
	beamerScroll = scroll;
	beamerZoom = zoom;

	$("#content").stop().animate({
		fontSize: zoom + "em",
		marginTop: scroll + "em"
	}, 500);
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
	$("#currentTime").text("⌚ " + hours + ":" + minutes);
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

	apiClient.on('updateApplication', function (applicationid, application) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:applicationNotFound', function (applicationid) {
		showError("Der Antrag wurde nicht gefunden");
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
			if (slide.type == 'text') {
				showView("text", { title: slide.title, text: slide.text });
			}
			if (slide.type == 'html') {
				showView("html", { title: slide.title, html: slide.html });
			}
			if (slide.type == 'agenda') {
				showView("agenda", { title: slide.title });
			}
			if (slide.type == 'application') {
				configureApplication(slide.applicationid);
			}
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

	apiClient.on("updateBeamer", function (beamerid, beamer) {
		if (beamer.currentslideid) {
			configureSlide(beamer.currentslideid);
		} else {
			showError("Der Beamer ist nicht konfiguriert", "Es ist keine Folie für den Beamer konfiguriert");
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
		$("#timers #timer-" + timerid).text("⌛ " + formatTime(currentValue));
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
		showView("application", { applicationid: applicationid, application: application });
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
