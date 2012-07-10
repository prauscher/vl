// vim:noet:sw=8:

var projectorsCurrentSlide = {};

$(function () {
	var showSlideOptions = generateShowOptionsModal({
		modal : "#agenda #options",
		fields : [
			{ property : "title", field : "#title", type : "text" },
			{ property : "text", field : "#slidecontent-text-text", type : "text" },
			{ property : "html", field : "#slidecontent-html-html", type : "text" },
			{ property : "motionid", field : "#slidecontent-motion-motionid", type : "text" },
			{ property : "electionid", field : "#slidecontent-election-electionid", type : "text" }
		],
		fillModal : function (modal, id, item) {
			$(modal).find(".nav .slidecontent-" + item.type).tab('show');
			$(modal).find(".nav a").unbind("show").on("show", function (e) {
				item.type = e.target.className.split("-").pop();
			});
		},
		fillItem : function (modal, id, item) {
			if (item.type != "text") {
				delete item.text;
			}
			if (item.type != "html") {
				delete item.html;
			}
			if (item.type != "motion") {
				delete item.motionid;
			}
			if (item.type != "election") {
				delete item.electionid;
			}
		},
		saveCallback : apiClient.saveSlide,
		deleteCallback : apiClient.deleteSlide
	});

	$("#agenda ol#slides").treeTable({
		styles: {
			slide: { title: {width: "350px", cursor: "pointer"} }
		},
		move: function (slideid, parentid, position) {
			apiClient.moveSlide(slideid, (parentid ? parentid : undefined), position);
		}
	});

	apiClient.on("initSlide", function (slideid, parentid, position) {
		$("#agenda ol#slides").treeTable("add", "slide", slideid, "slide", parentid, position, {
			"title": $("<span>"),
			"select-projectors" : $("<span>").selectProjector({
				prefix : "Anzeigen auf ",
				clickProjector : function (projectorid) {
					apiClient.getProjector(projectorid, function (projector) {
						projector.currentslideid = slideid;
						apiClient.saveProjector(projectorid, projector);
					});
				}
			}),
			"options": $("<span>")
				.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Als nicht erledigt markieren"))
				.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Als erledigt markieren"))
				.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","In Agendaansicht verstecken"))
				.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","In Agendaansicht anzeigen"))
				.append($("<a>").attr("href", "/slides/" + slideid).append($("<i>").addClass("icon-play-circle").attr("title", "Folie öffnen")))
		});
		for (var projectorid in projectorsCurrentSlide) {
			if (projectorsCurrentSlide[projectorid] == slideid) {
				$("#agenda ol#slides").treeTable("get", "slide", slideid, "select-projectors").selectProjector("toggleActive", projectorid, true);
			}
		}
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		$("#agenda ol#slides").treeTable("get", "slide", slideid, "title").text(slide.title || "Unbenannt").toggleClass("untitled", !slide.title).unbind("click").click(function() {
			showSlideOptions(slideid, slide);
		});

		var options = $("#agenda ol#slides").treeTable("get", "slide", slideid, "options");
		options.children(".isundone").unbind("click").toggle(slide.isdone != "true").click(function () {
			slide.isdone = true;
			apiClient.saveSlide(slideid, slide);
		});
		options.children(".isdone").unbind("click").toggle(slide.isdone == "true").click(function () {
			slide.isdone = false;
			apiClient.saveSlide(slideid, slide);
		});

		options.children(".isvisible").unbind("click").toggle(slide.hidden != "true").click(function () {
			slide.hidden = true;
			apiClient.saveSlide(slideid, slide);
		});
		options.children(".ishidden").unbind("click").toggle(slide.hidden == "true").click(function () {
			slide.hidden = false;
			apiClient.saveSlide(slideid, slide);
		});
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#agenda ol#slides").treeTable("remove", "slide", slideid);
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		$("#agenda .select-projector-" + projectorid).removeClass("active");
		projectorsCurrentSlide[projectorid] = projector.currentslideid;
		$("#agenda ol#slides").treeTable("get", "slide", projector.currentslideid, "select-projectors").children(".select-projector-" + projectorid).addClass("active");
	});

	apiClient.on("initMotion", function (motionid, classid, position) {
		$("#agenda #options #slidecontent-motion-motionid").append(
			$("<option>").addClass("motion-" + motionid).attr("value", motionid) )
	});

	apiClient.on("updateMotion", function (motionid, motion) {
		$("#agenda #options #slidecontent-motion-motionid option.motion-" + motionid).text(motionid + ": " + motion.title);
	});

	apiClient.on("deleteMotion", function (motionid) {
		$("#agenda #options #slidecontent-motion-motionid option.motion-" + motionid).remove();
	});

	apiClient.on("initElection", function (electionid) {
		$("#agenda #options #slidecontent-election-electionid").append(
			$("<option>").addClass("election-" + electionid).attr("value", electionid) )
	});

	apiClient.on("updateElection", function (electionid, election) {
		$("#agenda #options #slidecontent-election-electionid option.election-" + electionid).text(election.title);
	});

	apiClient.on("deleteElection", function (motionid) {
		$("#agenda #options #slidecontent-election-electionid option.election-" + electionid).remove();
	});

	$("#new-slide").click(function () {
		showSlideOptions(null, {
			hidden : true,
			isdone : false,
			type : "text"
		});
	});
});
