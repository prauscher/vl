var currentlyPickedProjector = null;
var currentDefaultProjector = null;

function pickProjector(projectorid) {
	currentlyPickedProjector = projectorid;
	$.cookie("currentlyPickedProjector", projectorid);

	$("#showprojector li").removeClass("active");

	if (projectorid != null) {
		$(".select-projector").hide();
		$("#showprojector .select-projector").show();
		$(".select-projector-" + projectorid).show();
		$("#showprojector #showprojector-" + projectorid).addClass("active");
	} else {
		$(".select-projector").show();
	}
}

function showProjectorOptions(projectorid, projector) {
	if (projectorid == null) {
		projectorid = generateID();
		projector.hidden = true;
		projector.scroll = 0;
		projector.zoom = 1;
		$("#projectors #projector-options #delete-projector").hide();
	} else {
		$("#projectors #projector-options #delete-projector").show();
	}

	$("#projectors #projector-options #title").val(projector.title);
	$("#projectors #projector-options #color").val(projector.color).miniColors();

	$("#projectors #projector-options #delete-projector").unbind("click").click(function () {
		apiClient.deleteProjector(projectorid, function () {
			$("#projectors #projector-options").modal('hide');
		});
	});

	$("#projectors #projector-options #save-projector").unbind("click").click(function () {
		projector.title = $("#projectors #projector-options #title").val();
		projector.color = $("#projectors #projector-options #color").val();
		apiClient.saveProjector(projectorid, projector, function () {
			$("#projectors #projector-options").modal('hide');
		});
	});

	$("#projectors #projector-options").modal();
}

function generateSelectProjectorButton(projectorid, callbacks, prefix) {
	if (prefix == null)
		prefix = "Beamer: ";

	apiClient.getProjector(projectorid, function (projector) {
		callbacks.create($("<img>")
			.attr("data-prefix", prefix)
			.attr("src", "/images/empty.gif")
			.addClass("select-projector")
			.addClass("select-projector-" + projectorid)
			.css("background-color", projector.color)
			.attr("title", prefix + projector.title)
			.toggle(currentlyPickedProjector == null || currentlyPickedProjector == projectorid)
			.click(callbacks.click) );
	});
}

function generateSelectProjectorHandoverButton(sourceProjectorid, targetProjectorid, callback) {
	generateSelectProjectorButton(sourceProjectorid, {
		click : function () {
			apiClient.getProjector(sourceProjectorid, function (sourceProjector) {
				apiClient.getProjector(targetProjectorid, function (targetProjector) {
					targetProjector.zoom = sourceProjector.zoom;
					targetProjector.scroll = sourceProjector.scroll;
					targetProjector.currentslideid = sourceProjector.currentslideid;
					apiClient.saveProjector(targetProjectorid, targetProjector);

					apiClient.eachProjectorTimer(targetProjectorid, function (timerid, timer) {
						apiClient.projectorHasTimer(sourceProjectorid, timerid, function (hasTimer) {
							if (! hasTimer) {
								apiClient.hideTimerProjector(targetProjectorid, timerid);
							}
						});
					});
					apiClient.eachProjectorTimer(sourceProjectorid, function (timerid, timer) {
						apiClient.projectorHasTimer(targetProjectorid, timerid, function (hasTimer) {
							if (! hasTimer) {
								apiClient.showTimerProjector(targetProjectorid, timerid);
							}
						});
					});
				});
			});
		},
		create : callback
	}, "Folie übernehmen von: ");
}

function generateSelectProjectorSlideButton(projectorid, slideid, callback) {
	generateSelectProjectorButton(projectorid, {
		click : function () {
			apiClient.getProjector(projectorid, function (projector) {
				projector.currentslideid = slideid;
				apiClient.saveProjector(projectorid, projector);
			});
		},
		create : callback
	}, "Anzeigen auf: ");
}

function generateSelectProjectorTimerButton(projectorid, timerid, callback) {
	generateSelectProjectorButton(projectorid, {
		click : function () {
			if ($(this).hasClass("active")) {
				apiClient.hideTimerProjector(projectorid, timerid);
			} else {
				apiClient.showTimerProjector(projectorid, timerid);
			}
		},
		create : callback
	}, "Anzeigen auf: ");
}

$(function () {
	apiClient.on("setDefaultProjector", function (projectorid) {
		currentDefaultProjector = projectorid;
		$("#projectors .set-default").removeClass("icon-star").addClass("icon-star-empty");
		$("#projectors #projector-" + projectorid + " .set-default").removeClass("icon-star-empty").addClass("icon-star");
	});

	apiClient.on("initProjector", function (projectorid, projector) {
		$("#showprojector ul").append($("<li>").attr("id", "showprojector-" + projectorid).toggleClass("active", (currentlyPickedProjector == projectorid))
			.append($("<a>")
				.append($("<img>")
					.attr("src", "/images/empty.gif")
					.addClass("select-projector")
					.addClass("active")
					.addClass("select-projector-" + projectorid) )
				.append(" ")
				.append($("<span>").addClass("title")) ) );

		var handoverProjector = $("<td>").addClass("handover-projector");

		apiClient.eachProjector(function (targetProjectorid, targetProjector) {
			if (targetProjectorid != projectorid) {
				generateSelectProjectorHandoverButton(projectorid, targetProjectorid, function(handoverProjectorButton) {
					$("#projectors #projector-" + targetProjectorid + " .handover-projector").append(handoverProjectorButton.addClass("active"));
				});
				generateSelectProjectorHandoverButton(targetProjectorid, projectorid, function(handoverProjectorButton) {
					handoverProjector.append(handoverProjectorButton.addClass("active"));
				});
			}
		});

		var starIcon = (projectorid == currentDefaultProjector) ? "icon-star" : "icon-star-empty";

		$("#projectors #projectors").append($("<tr>").attr("id", "projector-" + projectorid)
			.append($("<td>").append($("<img>").attr("src", "/images/empty.gif").addClass("color")))
			.append($("<td>").addClass("title"))
			.append(handoverProjector.addClass("handover-buttons"))
			.append($("<td>").addClass("options")
				.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","Auf Startseite verstecken"))
				.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","Auf Startseite anzeigen"))
				.append($("<i>").addClass(starIcon).addClass("set-default").attr("title", "Als Standard setzen"))
				.append($("<i>").addClass("icon-repeat").addClass("reset").attr("title", "Ansicht zurücksetzen"))
				.append($("<i>").addClass("icon-zoom-in").addClass("zoom-in").attr("title", "Schrift vergrößern"))
				.append($("<i>").addClass("icon-zoom-out").addClass("zoom-out").attr("title", "Schrift verkleinern"))
				.append($("<i>").addClass("icon-chevron-up").addClass("scroll-up").attr("title", "Hinaufscrollen"))
				.append($("<i>").addClass("icon-chevron-down").addClass("scroll-down").attr("title", "Hinabscrollen"))
				.append($("<a>").attr("href","/projectors/" + projectorid).append($("<i>").addClass("icon-play-circle").attr("title", "Projector öffnen"))) ) );
	});

	apiClient.on("showTimerProjector", function (projectorid, timerid, timer) {
		$("#timers #timer-" + timerid + " .select-projector-" + projectorid).addClass("active");
	});

	apiClient.on("hideTimerProjector", function (projectorid, timerid, timer) {
		$("#timers #timer-" + timerid + " .select-projector-" + projectorid).removeClass("active");
	});

	apiClient.on("updateProjector", function(projectorid, projector) {
		$("#showprojector #showprojector-" + projectorid).unbind("click").click(function () {
			pickProjector(projectorid);
		});
		$("#showprojector #showprojector-" + projectorid + " .title").text(projector.title);

		$("#projectors #projector-" + projectorid + " .color").css("background-color", projector.color);
		$("#projectors #projector-" + projectorid + " .title").text(projector.title || "Unbenannt").toggleClass("untitled", !projector.title).unbind("click").click(function () {
			showProjectorOptions(projectorid, projector);
		});

		$("#projectors #projector-" + projectorid + " .isvisible").toggle(projector.hidden != "true").unbind("click").click(function () {
			projector.hidden = true;
			apiClient.saveProjector(projectorid, projector);
		});
		$("#projectors #projector-" + projectorid + " .ishidden").toggle(projector.hidden == "true").unbind("click").click(function () {
			projector.hidden = false;
			apiClient.saveProjector(projectorid, projector);
		});

		$("#projectors #projector-" + projectorid + " .reset").unbind("click").click(function () {
			projector.zoom = 1;
			projector.scroll = 0;
			apiClient.saveProjector(projectorid, projector);
		});

		$("#projectors #projector-" + projectorid + " .set-default").unbind("click").click(function () {
			apiClient.setDefaultProjector(projectorid);
		});

		$("#projectors #projector-" + projectorid + " .zoom-in").unbind("click").click(function () {
			projector.zoom *= 1.1;
			apiClient.saveProjector(projectorid, projector);
		});

		$("#projectors #projector-" + projectorid + " .zoom-out").unbind("click").click(function () {
			projector.zoom /= 1.1;
			apiClient.saveProjector(projectorid, projector);
		});

		$("#projectors #projector-" + projectorid + " .scroll-up").unbind("click").click(function () {
			projector.scroll--;
			apiClient.saveProjector(projectorid, projector);
		});

		$("#projectors #projector-" + projectorid + " .scroll-down").unbind("click").click(function () {
			projector.scroll++;
			apiClient.saveProjector(projectorid, projector);
		});

		$(".select-projector-" + projectorid)
			.css("background-color", projector.color)
			.each(function(index) {
				$(this).attr("title", $(this).attr("data-prefix") + projector.title);
			});
	});

	apiClient.on("deleteProjector", function(projectorid) {
		$("#showprojector-" + projectorid).remove();
		$("#projectors #projector-" + projectorid).remove();

		$(".select-projector-" + projectorid).remove();
		$("#projector #projector-" + projectorid).remove();
	});

	$("#new-projector").click(function () {
		showProjectorOptions(null, {});
	});

	$("#identify-projectors").click(function () {
		$.ajax({
			type: 'POST',
			url: '/identify-projectors',
			data: { timeout: 5 }
		});
	});

	$("#showprojectors").click(function () {
		pickProjector(null);
	});

	if ($.cookie("currentlyPickedProjector")) {
		pickProjector($.cookie("currentlyPickedProjector"));
	}
});
