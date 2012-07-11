var currentProjectorID = null;

function configureProjector(projectorid) {
<<<<<<< HEAD
	configureSlide();
	if (projectorid) {
		resetView();
		apiClient.registerIdentifyProjector();
		apiClient.registerProjector(projectorid);
	}
}

function configureSlide(slideid) {
	if (currentSlideID != null) {
		apiClient.unregisterSlide(currentSlideID);
		currentSlideID = null;
	}
	$('#content .content-agenda').empty();
	configureMotion();
	configureElection();
	configureBallot();
	if (slideid) {
		resetView();
		apiClient.registerSlide(slideid, 1);
		currentSlideID = slideid;
	}
}

function configureMotion(motionid) {
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

function configureElection(electionid) {
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

function configureBallot(ballotid) {
	if (currentBallotID != null) {
		apiClient.unregisterBallot(currentBallotID);
		currentBallotID = null;
	}
	$('#content .ballot-options').empty();
	if (ballotid) {
		resetView();
		apiClient.registerBallot(ballotid);
		currentBallotID = ballotid;
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

function numberLines(text) {
	var lines = text.split("\n");
	var tag = $("<ol>").addClass("line-numbers");
	$.each(lines, function(idx, line) {
	        tag.append($("<li>").append($("<span>").text(line)));
	});
	return tag;
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
		$(".motion-text").append(numberLines(options.motion.text));
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
	if (projectorid != currentProjectorID) {
		if (currentProjectorID != null) {
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

$(function () {
	apiClient.on('error:projectorNotFound', function (projectorid) {
		showError("Der Projector wurde nicht gefunden");
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

	apiClient.on("deleteProjector", function (projectorid) {
		showError("Der Projector wurde gelöscht");
	});

	apiClient.on("identifyProjector", function (timeout) {
		$("#identify").fadeIn(100);
		window.setTimeout(function () {
			$("#identify").fadeOut(300);
		}, timeout * 1000);
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
			var timerContainer = $("<div>").attr("id", "timer-" + timerid).addClass("timer");

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
});
