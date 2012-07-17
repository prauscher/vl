// vim:noet:sw=8:

var projectorsCurrentSlide = {};

$(function () {
	var showSlideOptions = generateShowOptionsModal({
		modal : "#agenda #options",
		fields : [
			{ property : "title", field : "#title", type : "text" },
			{ property : "text", field : "#slidecontent-text-text", type : "text" },
			{ property : "html", field : "#slidecontent-html-html", type : "text" },
			{ property : "motionid", field : "#slidecontent-motion-motionid", type : "select" },
			{ property : "motionBallotid", field : "#slidecontent-motion-ballotid", type : "select" },
			{ property : "electionid", field : "#slidecontent-election-electionid", type : "select" },
			{ property : "electionBallotid", field : "#slidecontent-election-ballotid", type : "select" }
		],
		fillModal : function (modal, id, item) {
			$(modal).find(".nav .slidecontent-" + item.type).tab('show');
			$(modal).find(".nav a").unbind("show").on("show", function (e) {
				item.type = e.target.className.split("-").pop();
			});

			function dropdownBallot(parentDropdown, ballotDropdown, register) {
				$(modal).find(parentDropdown)
					.unbind("change").change(function () {
						$(modal).find(ballotDropdown)
							.removeClass()
							.addClass("selected-" + $(this).val())
							.empty()
							.append($("<option>").attr("value", "").text("(kein)"));
						register($(this).val());
					})
					.change();
			}
			dropdownBallot("#slidecontent-motion-motionid", "#slidecontent-motion-ballotid", function (id) {
				apiClient.registerMotionBallots(id);
			});
			dropdownBallot("#slidecontent-election-electionid", "#slidecontent-election-ballotid", function (id) {
				apiClient.registerElectionBallots(id);
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
				delete item.motionBallotid;
			}
			if (item.type != "election") {
				delete item.electionid;
				delete item.electionBallotid;
			}
		},
		saveCallback : apiClient.saveSlide,
		deleteCallback : apiClient.deleteSlide
	});

	function generateAddBallotDropdown(ballotDropdown) {
		return function (id, ballotid) {
			if ($("#agenda #options").find(ballotDropdown).filter(".selected-" + id).find(".ballot-" + ballotid).length == 0) {
				$("#agenda #options").find(ballotDropdown).filter(".selected-" + id)
					.append($("<option>").attr("value",ballotid).addClass("ballot-" + ballotid))
					.val($("#agenda #options").find(ballotDropdown).filter(".selected-" + id).attr("data-initValue"));
			}
		}
	}

	apiClient.on("initMotionBallot", generateAddBallotDropdown("#slidecontent-motion-ballotid"));
	apiClient.on("initElectionBallot", generateAddBallotDropdown("#slidecontent-election-ballotid"));

	apiClient.on("updateBallot", function (ballotid, ballot) {
		$("#agenda #options").find(".ballot-" + ballotid).text(ballot.title);
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
				.append($("<a>").attr("href", "/projector#slide-" + slideid).append($("<i>").addClass("icon-play-circle").attr("title", "Folie öffnen")))
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
		$("#agenda #options #slidecontent-motion-motionid").sortedList("add", motionid,
			$("<option>").attr("value", motionid) )
	});

	apiClient.on("updateMotion", function (motionid, motion) {
		$("#agenda #options #slidecontent-motion-motionid").sortedList("get", motionid).text(motionid + ": " + motion.title);
	});

	apiClient.on("deleteMotion", function (motionid) {
		$("#agenda #options #slidecontent-motion-motionid").sortedList("remove", motionid);
	});

	$("#agenda #options #slidecontent-motion-motionid").sortedList();

	apiClient.on("initElection", function (electionid) {
		$("#agenda #options #slidecontent-election-electionid").sortedList("add", electionid,
			$("<option>").attr("value", electionid) )
	});

	apiClient.on("updateElection", function (electionid, election) {
		$("#agenda #options #slidecontent-election-electionid").sortedList("get", electionid).text(election.title);
	});

	apiClient.on("deleteElection", function (electionid) {
		$("#agenda #options #slidecontent-election-electionid").sortedList("remove", electionid);
	});

	$("#agenda #options #slidecontent-election-electionid").sortedList();

	$("#new-slide").click(function () {
		showSlideOptions(null, {
			hidden : true,
			isdone : false,
			type : "text"
		});
	});
});
