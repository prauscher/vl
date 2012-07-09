var currentDefaultProjector = null;

$(function () {
	var showProjectorOptions = generateShowOptionsModal({
		modal : "#projectors #projector-options",
		fields : [
			{ property : "title", field : "#title", type : "text" },
			{ property : "color", field : "#color", type : "color" }
		],
		saveCallback : apiClient.saveProjector,
		deleteCallback : apiClient.deleteProjector
	});

	apiClient.on("setDefaultProjector", function (projectorid) {
		currentDefaultProjector = projectorid;
		$("#projectors .set-default").removeClass("icon-star").addClass("icon-star-empty");
		$("#projectors #projector-" + projectorid + " .set-default").removeClass("icon-star-empty").addClass("icon-star");
	});

	apiClient.on("initProjector", function (projectorid, projector) {
		var starIcon = (projectorid == currentDefaultProjector) ? "icon-star" : "icon-star-empty";

		$("#projectors #projectors").append($("<tr>").attr("id", "projector-" + projectorid)
			.append($("<td>").append($("<img>").attr("src", "/images/empty.gif").addClass("color")))
			.append($("<td>").addClass("title"))
			.append($("<td>").addClass("handover-buttons").selectProjector({
				prefix : "Folie übernehmen von ",
				defaultActive : true,
				except : [ projectorid ],
				clickProjector : function (sourceProjectorid) {
					apiClient.getProjector(sourceProjectorid, function (sourceProjector) {
						apiClient.getProjector(projectorid, function (targetProjector) {
							targetProjector.zoom = sourceProjector.zoom;
							targetProjector.scroll = sourceProjector.scroll;
							targetProjector.currentslideid = sourceProjector.currentslideid;
							apiClient.saveProjector(projectorid, targetProjector);

							apiClient.eachProjectorTimer(projectorid, function (timerid, timer) {
								apiClient.projectorHasTimer(sourceProjectorid, timerid, function (hasTimer) {
									if (! hasTimer) {
										apiClient.hideTimerProjector(projectorid, timerid);
									}
								});
							});
							apiClient.eachProjectorTimer(sourceProjectorid, function (timerid, timer) {
								apiClient.projectorHasTimer(projectorid, timerid, function (hasTimer) {
									if (! hasTimer) {
										apiClient.showTimerProjector(projectorid, timerid);
									}
								});
							});
						});
					});
				}
			}))
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

	apiClient.on("updateProjector", function(projectorid, projector) {
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
	});

	apiClient.on("deleteProjector", function(projectorid) {
		$("#projectors #projector-" + projectorid).remove();
	});

	$("#new-projector").click(function () {
		showProjectorOptions(null, {
			hidden : true,
			scroll : 0,
			zoom : 1,
			color : generateColor()
		});
	});
});
