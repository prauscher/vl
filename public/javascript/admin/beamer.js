function showBeamerOptions(beamerid, beamer) {
	if (beamerid == null) {
		beamerid = Math.random().toString(36).replace(/[^a-zA-Z0-9]/,'').substring(0,7);
		beamer.scroll = 0;
		beamer.zoom = 1;
		$("#beamers #beamer-options #delete-beamer").hide();
	} else {
		$("#beamers #beamer-options #delete-beamer").show();
	}

	$("#beamers #beamer-options #title").val(beamer.title);
	$("#beamers #beamer-options #color").val(beamer.color);

	$("#beamers #beamer-options #delete-beamer").unbind("click").click(function () {
		apiClient.deleteBeamer(beamerid, function () {
			$("#beamers #beamer-options").modal('hide');
		});
	});

	$("#beamers #beamer-options #save-beamer").unbind("click").click(function () {
		beamer.title = $("#beamers #beamer-options #title").val();
		beamer.color = $("#beamers #beamer-options #color").val();
		apiClient.saveBeamer(beamerid, beamer, function () {
			$("#beamers #beamer-options").modal('hide');
		});
	});

	$("#beamers #beamer-options").modal();
}

function generateSelectBeamerButton(beamerid, callbacks) {
	apiClient.getBeamer(beamerid, function (beamer) {
		callbacks.create($("<img>")
			.addClass("select-beamer")
			.addClass("select-beamer-" + beamerid)
			.css("background-color", beamer.color)
			.attr("title","Beamer: " + beamer.title)
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
				apiClient.hideTimerBeamer(beamerid, timerid);
			} else {
				apiClient.showTimerBeamer(beamerid, timerid);
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

		$("#beamers #beamers").append($("<tr>").attr("id", "beamer-" + beamerid)
			.append($("<td>").append($("<img>").addClass("color")))
			.append($("<td>").addClass("title"))
			.append($("<td>")
				.append($("<i>").addClass("icon-repeat").addClass("reset"))
				.append($("<i>").addClass("icon-zoom-in").addClass("zoom-in"))
				.append($("<i>").addClass("icon-zoom-out").addClass("zoom-out"))
				.append($("<i>").addClass("icon-chevron-up").addClass("scroll-up"))
				.append($("<i>").addClass("icon-chevron-down").addClass("scroll-down"))
				.append($("<a>").attr("href","/beamer/" + beamerid).append($("<i>").addClass("icon-play-circle"))) ) );
	});

	apiClient.on("showTimerBeamer", function (beamerid, timerid, timer) {
		$("#timers #timer-" + timerid + " .select-beamer-" + beamerid).addClass("active");
	});

	apiClient.on("hideTimerBeamer", function (beamerid, timerid, timer) {
		$("#timers #timer-" + timerid + " .select-beamer-" + beamerid).removeClass("active");
	});

	apiClient.on("updateBeamer", function(beamerid, beamer) {
		$("#beamers #beamer-" + beamerid + " .color").css("background-color", beamer.color);
		$("#beamers #beamer-" + beamerid + " .title").text(beamer.title).unbind("click").click(function () {
			showBeamerOptions(beamerid, beamer);
		});

		$("#beamers #beamer-" + beamerid + " .reset").unbind("click").click(function () {
			beamer.zoom = 1;
			beamer.scroll = 0;
			apiClient.saveBeamer(beamerid, beamer);
		});

		$("#beamers #beamer-" + beamerid + " .zoom-in").unbind("click").click(function () {
			beamer.zoom *= 1.1;
			apiClient.saveBeamer(beamerid, beamer);
		});

		$("#beamers #beamer-" + beamerid + " .zoom-out").unbind("click").click(function () {
			beamer.zoom /= 1.1;
			apiClient.saveBeamer(beamerid, beamer);
		});

		$("#beamers #beamer-" + beamerid + " .scroll-up").unbind("click").click(function () {
			beamer.scroll -= 20;
			apiClient.saveBeamer(beamerid, beamer);
		});

		$("#beamers #beamer-" + beamerid + " .scroll-down").unbind("click").click(function () {
			beamer.scroll += 20;
			apiClient.saveBeamer(beamerid, beamer);
		});

		$(".select-beamer-" + beamerid).css("background-color", beamer.color);

		$("#agenda .select-beamer-" + beamerid).removeClass("active");
		$("#agenda #slide-" + beamer.currentslideid + " .select-beamer-" + beamerid).addClass("active");
	});

	apiClient.on("deleteBeamer", function(beamerid) {
		$("#beamers #beamer-" + beamerid).remove();

		$(".select-beamer-" + beamerid).remove();
		$("#beamer #beamer-" + beamerid).remove();
	});

	$("#new-beamer").click(function () {
		showBeamerOptions(null, {});
	});

	$("#identify-beamers").click(function () {
		$.ajax({
			type: 'POST',
			url: '/beamer-identify',
			data: { timeout: 5 }
		});
	});
});
