function generateSelectBeamerButton(beamerid, callbacks) {
	apiClient.getBeamer(beamerid, function (beamer) {
		callbacks.create($("<img>")
			.addClass("select-beamer")
			.addClass("select-beamer-" + beamerid)
			.css("background-color", beamer.color)
			.attr("title","Beamer: " + beamerid)
			.click(callbacks.click) );
	});
}

function generateSelectBeamerSlideButton(beamerid, slideid, callback) {
	generateSelectBeamerButton(beamerid, {
		click : function () {
			apiClient.getBeamer(beamerid, function (beamer) {
				beamer.currentslideid = slideid;
				apiClient.saveBeamer(beamerid, beamer);
			});
		},
		create : callback
	});
}

function generateSelectBeamerTimerButton(beamerid, timerid, callback) {
	generateSelectBeamerButton(beamerid, {
		click : function () {
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
		},
		create : callback
	});
}

$(function () {
	apiClient.on("initBeamer", function (beamerid, beamer) {
		apiClient.eachSlide(function (slideid, slide) {
			generateSelectBeamerSlideButton(beamerid, slideid, function (selectBeamerButton) {
				$("#agenda #slide-" + slideid + " .select-beamers").append(selectBeamerButton);
			});
		});
		apiClient.eachTimer(function (timerid, timer) {
			generateSelectBeamerTimerButton(beamerid, timerid, function (selectBeamerButton) {
				$("#timers #timer-" + timerid + " .select-beamers").append(selectBeamerButton);
			});
		});
	});

	apiClient.on("showTimerBeamer", function (beamerid, timerid, timer) {
		$("#timers #timer-" + timerid + " .select-beamer-" + beamerid).addClass("active");
	});

	apiClient.on("hideTimerBeamer", function (beamerid, timerid, timer) {
		$("#timers #timer-" + timerid + " .select-beamer-" + beamerid).removeClass("active");
	});

	apiClient.on("updateBeamer", function(beamerid, beamer) {
		$(".select-beamer-" + beamerid).css("background-color", beamer.color);
		$("#agenda .select-beamer-" + beamerid).removeClass("active");
		$("#agenda #slide-" + beamer.currentslideid + " .select-beamer-" + beamerid).addClass("active");
	});

	apiClient.on("deleteBeamer", function(beamerid) {
		$(".select-beamer-" + beamerid).remove();
		$("#beamer #beamer-" + beamerid).remove();
	});

	$("#identify-beamers").click(function () {
		$.ajax({
			type: 'POST',
			url: '/beamer-identify',
			data: { timeout: 5 }
		});
	});
});
