var beamerClient = {};

beamerClient.init = function (beamerid, beamer) {
	if (! beamers[beamerid]) {
		beamers[beamerid] = beamer;

		for (var slideid in slides) {
			$("#agenda #slide-" + slideid + " .select-beamers").append(this.generateSelectBeamerSlideButton(beamerid, slideid));
		}
		for (var timerid in timers) {
			$("#timers #timer-" + timerid + " .select-beamers").append(this.generateSelectBeamerTimerButton(beamerid, timerid));
		}
	}
}

beamerClient.flash = function (beamerid, flash) {
}

beamerClient.showTimer = function (beamerid, timerid, timer) {
	$("#timers #timer-" + timerid + " .select-beamer-" + beamerid).addClass("active");
}

beamerClient.hideTimer = function (beamerid, timerid, timer) {
	$("#timers #timer-" + timerid + " .select-beamer-" + beamerid).removeClass("active");
}

beamerClient.update = function(beamerid, beamer) {
	$(".select-beamer-" + beamerid).css("background-color", beamer.color);
	$("#agenda .select-beamer-" + beamerid).removeClass("active");
	$("#agenda #slide-" + beamer.currentslideid + " .select-beamer-" + beamerid).addClass("active");
}

beamerClient.delete = function(beamerid) {
	$(".select-beamer-" + beamerid).remove();
	$("#beamer #beamer-" + beamerid).remove();
}

beamerClient.generateSelectBeamerButton = function(beamerid, callbackClick) {
	return $("<img>").addClass("select-beamer").addClass("select-beamer-" + beamerid).css("background-color", beamers[beamerid].color).attr("title","Beamer: " + beamerid).click(callbackClick);
}

beamerClient.generateSelectBeamerSlideButton = function(beamerid, slideid) {
	return this.generateSelectBeamerButton(beamerid, function () {
		beamers[beamerid].currentslideid = slideid;
		saveBeamer(beamerid, beamers[beamerid]);
	});
}

beamerClient.generateSelectBeamerTimerButton = function(beamerid, timerid) {
	return this.generateSelectBeamerButton(beamerid, function () {
		if ($(this).hasClass("active")) {
			$.ajax({
				type: 'POST',
				url: '/beamer/' + beamerid + '/hidetimer',
				data: { timerid: timerid }
			});
		} else {
			$.ajax({
				type: 'POST',
				url: '/beamer/' + beamerid + '/showtimer',
				data: { timerid: timerid }
			});
		}
	});
}

$(function () {
	$("#identify-beamers").click(function () {
		$.ajax({
			type: 'POST',
			url: '/beamer-identify',
			data: { timeout: 5 }
		});
	});
});
