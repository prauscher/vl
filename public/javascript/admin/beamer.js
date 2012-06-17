function updateBeamerData(beamerid, beamer) {
	$(".select-beamer-" + beamerid).css("background-color", beamer.color);
	$("#agenda .select-beamer-" + beamerid).removeClass("active");
	$("#agenda #slide-" + beamer.currentslideid + " .select-beamer-" + beamerid).addClass("active");
}

function generateSelectBeamerButton(beamerid, callbackClick) {
	return $("<img>").addClass("select-beamer").addClass("select-beamer-" + beamerid).css("background-color", beamers[beamerid].color).attr("title","Beamer: " + beamerid).click(callbackClick);
}

function generateSelectBeamerSlideButton(beamerid, slideid) {
	return generateSelectBeamerButton(beamerid, function () {
		beamers[beamerid].currentslideid = slideid;
		saveBeamer(beamerid, beamers[beamerid]);
	});
}

function generateSelectBeamerTimerButton(beamerid, timerid) {
	return generateSelectBeamerButton(beamerid, function () {
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
			data: { timeout: 10 }
		});
	});
});
