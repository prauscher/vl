var currentProjectorID = null;
var currentSlideID = null;
var currentMotionID = null;
var currentElectionID = null;
var currentBallotID = null;

var projectorScroll = 0;
var projectorZoom = 1;

function resetView() {
	if ($("#error").is(":visible")) {
		$("#error").hide();
		$("#waiting").show();
	}
}

function configureDefaultProjector(useDefaultProjector) {
	if (!useDefaultProjector) {
		apiClient.unregisterDefaultProjector();
	}
	configureProjector();
	if (useDefaultProjector) {
		resetView();
		apiClient.registerDefaultProjector();
	}
}

$(function () {
	apiClient.on("setDefaultProjector", function (projectorid) {
		if (projectorid) {
			configureProjector(projectorid);
		} else {
			showError("Kein Projector als Default gesetzt");
		}
	});
});

function configureProjector(projectorid) {
	if (projectorid != currentProjectorID) {
		if (currentProjectorID == null) {
			apiClient.unregisterIdentifyProjector();
			apiClient.unregisterProjector(projectorid);
			currentProjectorID = null;
		}
		configureSlide();
		if (projectorid) {
			resetView();
			$("#timers").empty();
			apiClient.registerIdentifyProjector();
			apiClient.registerProjector(projectorid);
		}
	}
}

function configureSlide(slideid) {
	if (slideid != currentSlideID) {
		if (currentSlideID != null) {
			apiClient.unregisterSlide(currentSlideID);
			currentSlideID = null;
		}
		configureMotion();
		configureElection();
		configureBallot();
		if (slideid) {
			resetView();
			$('#content .content-agenda').empty();
			apiClient.registerSlide(slideid, 1);
			currentSlideID = slideid;
		}
	}
}

function configureMotion(motionid) {
	if (motionid != currentMotionID) {
		if (currentMotionID != null) {
			apiClient.unregisterMotion(currentMotionID);
			currentMotionID = null;
		}
		if (motionid) {
			resetView();
			apiClient.registerMotion(motionid);
			currentMotionID = motionid;
		}
	}
}

function configureElection(electionid) {
	if (electionid != currentElectionID) {
		if (currentElectionID != null) {
			apiClient.unregisterElection(currentElectionID);
			currentElectionID = null;
		}
		if (electionid) {
			resetView();
			apiClient.registerElection(electionid);
			currentElectionID = electionid;
		}
	}
}

function configureBallot(ballotid) {
	if (ballotid != currentBallotID) {
		if (currentBallotID != null) {
			apiClient.unregisterBallot(currentBallotID);
			currentBallotID = null;
		}
		if (ballotid) {
			resetView();
			$('#content .ballot-options').empty();
			apiClient.registerBallot(ballotid);
			currentBallotID = ballotid;
		}
	}
}

function clearView() {
	$('#content .content-text').hide();
	$('#content .content-html').hide();
	$('#content .content-agenda').hide();
	$('#content .content-motion').hide();
	$('#content .content-election').hide();
	$('#content .content-ballot').hide();
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
	if (type == "motion") {
		$('#title').text(options.motion.title);
		$(".motionid").text(options.motionid);
		$(".motion-text").text(options.motion.text);
		$(".motion-argumentation").text(options.motion.argumentation);
		$(".motion-submitter").text(options.motion.submitter);
		$(".motion-status *").hide();
		$(".motion-status .status-" + options.motion.status).show();
		$('#content .content-motion').show();
	}
	if (type == "election") {
		$('#title').text(options.election.title);
		$('#content .content-election').show();
	}
	if (type == "ballot") {
		$('.ballot-maxvotes').text(options.ballot.maxvotes);
		$('.ballot-status *').hide();
		$('.ballot-status .status-' + options.ballot.status).show();
		$('#content .content-ballot').show();
	}
}

function setViewerData(scroll, zoom) {
	projectorScroll = scroll;
	projectorZoom = zoom;

	$("#content").stop().animate({
		fontSize: zoom + "em",
		marginTop: (scroll * 3) + "em"
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

	apiClient.on('updateProjector', function (projectorid, projector) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:projectorNotFound', function (projectorid) {
		showError("Der Projector wurde nicht gefunden");
	});

	apiClient.on('updateMotion', function (motionid, motion) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:motionNotFound', function (motionid) {
		showError("Der Antrag wurde nicht gefunden");
	});

	apiClient.on('updateElection', function (electionid, election) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:electionNotFound', function (electionid) {
		showError("Die Wahl wurde nicht gefunden");
	});

	apiClient.on('updateBallot', function (ballotid, ballot) {
		$("#waiting").fadeOut(300);
	});
	apiClient.on('error:ballotNotFound', function (ballotid) {
		showError("Der Wahlgang wurde nicht gefunden");
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		if (projector.currentslideid) {
			configureSlide(projector.currentslideid);
		} else {
			showError("Der Projector ist nicht konfiguriert", "Es ist keine Folie für den Projector konfiguriert");
		}
		setViewerData(projector.scroll, projector.zoom);
		$("#identify").css("background-color", projector.color).text(projector.title);
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
			if (slide.type == 'motion') {
				configureMotion(slide.motionid);
			}
			if (slide.type == 'election') {
				configureElection(slide.electionid);
			}
			if (slide.type == 'ballot') {
				configureBallot(slide.ballotid);
			}
		} else {
			$("#content .content-agenda #agenda-" + slideid).text(slide.title).toggleClass("done", slide.isdone == "true").toggle(slide.hidden != "true");
		}
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

	apiClient.on("deleteSlide", function (slideid) {
		$("#content .content-agenda #agenda-" + slideid).remove();
	});

	apiClient.on("identifyProjector", function (timeout) {
		$("#identify").fadeIn(100);
		window.setTimeout(function () {
			$("#identify").fadeOut(300);
		}, timeout * 1000);
	});

	apiClient.on("deleteProjector", function (projectorid) {
		showError("Der Projector wurde gelöscht");
	});

	apiClient.on("flashProjector", function (projectorid, flash) {
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

	apiClient.on("showTimerProjector", function (projectorid, timerid, timer) {
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

	apiClient.on("hideTimerProjector", function (projectorid, timerid, timer) {
		this.unregisterTimer(timerid);
		$("#timers #timer-" + timerid).hide();
	});

	apiClient.on("updateMotion", function (motionid, motion) {
		showView("motion", { motionid: motionid, motion: motion });
	});

	apiClient.on("updateElection", function (electionid, election) {
		showView("election", { electionid: electionid, election: election });
	});

	apiClient.on("updateBallot", function (ballotid, ballot) {
		showView("ballot", { ballotid: ballotid, ballot: ballot });
	});

	apiClient.on("initBallotOption", function (ballotid, optionid, position) {
		var item = $("<li>").addClass("option-" + optionid)
			.append($("<span>").addClass("title"));

		if (position == 0) {
			$(".ballot-options").prepend(item);
		} else {
			$(".ballot-options li:eq(" + (position-1) + ")").after(item);
		}
	});

	apiClient.on("updateOption", function (optionid, option) {
		$(".ballot-options .option-" + optionid).toggle(option.hidden != "true")
		$(".ballot-options .option-" + optionid + " .title").text(option.title);
	});

	apiClient.on("deleteOption", function (optionid) {
		$(".ballot-options .option-" + optionid).remove();
	});

	$("#projector-reset").click(function() {
		setViewerData(0, 1);
	});
	$("#projector-zoom-in").click(function () {
		setViewerData(projectorScroll, projectorZoom * 1.1);
	});
	$("#projector-zoom-out").click(function () {
		setViewerData(projectorScroll, projectorZoom / 1.1);
	});
	$("#projector-scroll-up").click(function () {
		setViewerData(projectorScroll - 1, projectorZoom);
	});
	$("#projector-scroll-down").click(function () {
		setViewerData(projectorScroll + 1, projectorZoom);
	});

	clearView();
	updateCurrentTime();
	window.setInterval(updateCurrentTime, 1000);
});
