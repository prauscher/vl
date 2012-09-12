// vim:noet:sw=8:

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
		if (currentDefaultProjector != null) {
			$("#projectors tbody").sortedList("get", currentDefaultProjector).find(".set-default")
				.removeClass("icon-star").addClass("icon-star-empty");
		}
		currentDefaultProjector = projectorid;
		$("#projectors tbody").sortedList("get", projectorid).find(".set-default")
			.removeClass("icon-star-empty").addClass("icon-star");
	});

	apiClient.on("initProjector", function (projectorid, projector) {
		var starIcon = (projectorid == currentDefaultProjector) ? "icon-star" : "icon-star-empty";

		$("#projectors tbody").sortedList("add", projectorid, $("<tr>")
			.append($("<td>").append($("<img>").attr("src", "/images/empty.gif").addClass("color")))
			.append($("<td>").addClass("title"))
			.append($("<td>").addClass("handover-buttons").selectProjector({
				prefix : "Folie übernehmen von ",
				defaultActive : true,
				except : [ projectorid ],
				clickProjector : function (sourceProjectorid) {
					apiClient.handoverProjector(sourceProjectorid, projectorid);
				}
			}))
			.append($("<td>").addClass("options")
				.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","Auf Startseite verstecken"))
				.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","Auf Startseite anzeigen"))
				.append($("<i>").addClass(starIcon).addClass("set-default").attr("title", "Als Standard setzen"))
				.append($("<span>").addClass("viewerOptions"))
				.append($("<a>").attr("href","/projector#projector:" + projectorid).append($("<i>").addClass("icon-play-circle").attr("title", "Projector öffnen")))
				.append($("<a>").attr("href","/timer#projector:" + projectorid).append($("<i>").addClass("icon-bell").attr("title", "Timeransicht öffnen"))) ) );
	});

	apiClient.on("updateProjector", function(projectorid, projector) {
		$("#projectors tbody").sortedList("get", projectorid).find(".color")
			.css("background-color", projector.color);
		$("#projectors tbody").sortedList("get", projectorid).find(".title")
			.text(projector.title || "Unbenannt")
			.toggleClass("untitled", !projector.title)
			.unbind("click")
			.click(function () {
				showProjectorOptions(projectorid, projector);
			});
		$("#projectors tbody").sortedList("get", projectorid).find(".set-default")
			.unbind("click")
			.click(function () {
				apiClient.setDefaultProjector(projectorid);
			});
		$("#projectors tbody").sortedList("get", projectorid).find(".isvisible")
			.toggle(projector.hidden != "true")
			.unbind("click")
			.click(function () {
				projector.hidden = true;
				apiClient.saveProjector(projectorid, projector);
			});
		$("#projectors tbody").sortedList("get", projectorid).find(".ishidden")
			.toggle(projector.hidden == "true")
			.unbind("click")
			.click(function () {
				projector.hidden = false;
				apiClient.saveProjector(projectorid, projector);
			});
		$("#projectors tbody").sortedList("get", projectorid).find(".viewerOptions").viewerOptions({
			zoom: projector.zoom,
			scroll: projector.scroll,
			callback: function (zoom, scroll) {
				projector.zoom = zoom;
				projector.scroll = scroll;
				apiClient.saveProjector(projectorid, projector);
			}
		});
	});

	apiClient.on("deleteProjector", function(projectorid) {
		$("#projectors tbody").sortedList("remove", projectorid);
	});

	$("#projectors tbody").sortedList();

	$("#new-projector").click(function () {
		showProjectorOptions(null, {
			hidden : true,
			scroll : 0,
			zoom : 1,
			color : generateColor()
		});
	});
});
