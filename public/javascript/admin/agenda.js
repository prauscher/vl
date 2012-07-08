// vim:noet:sw=8:

function showSlideOptions(slideid, slide) {
	if (slideid == null) {
		slideid = generateID();
		slide.hidden = true;
		slide.isdone = false;
		slide.type = "text";
		$("#agenda #options #delete-slide").hide();
	} else {
		$("#agenda #options #delete-slide").show();
	}

	$("#agenda #options input#title").val(slide.title);

	$("#agenda #options #slidecontent .nav .slidecontent-" + slide.type).tab('show');
	$("#agenda #options #slidecontent .nav a").unbind("show").on("show", function (e) {
		slide.type = e.target.className.split("-").pop();
	});

	$("#agenda #options #slidecontent-text-text").val(slide.text);
	$("#agenda #options #slidecontent-html-html").val(slide.html);

	$("#agenda #options form").unbind("submit").submit(function() {
		$("#agenda #options #save-slide").click();
	});
	$("#agenda #options #save-slide").unbind("click").click(function() {
		slide.title = $("#agenda #options input#title").val();

		slide.text = $("#agenda #options #slidecontent-text-text").val();
		slide.html = $("#agenda #options #slidecontent-html-html").val();
		slide.motionid = $("#agenda #options #slidecontent-motion-motionid option:selected").val();

		apiClient.saveSlide(slideid, slide, function() {
			$("#agenda #options").modal('hide')
		});
	});
	$("#agenda #options #delete-slide").unbind("click").click(function() {
		apiClient.deleteSlide(slideid, function () {
			$("#agenda #options").modal('hide');
		});
	});

	$("#agenda #options").modal();
}

$(function () {
	var agendaTreeTable = new TreeTable("#agenda ol#slides");
	agendaTreeTable.setStyle("slide", "title", {width: "350px", cursor: "pointer"});
	agendaTreeTable.onMove(function (slideid, parentid, position) {
		apiClient.moveSlide(slideid, (parentid ? parentid : undefined), position);
	});

	apiClient.on("initSlide", function (slideid, parentid, position) {
		var selectProjectors = $("<span>");
		apiClient.eachProjector(function (projectorid, projector) {
			generateSelectProjectorSlideButton(projectorid, slideid, function (selectProjectorButton) {
				if (projector.currentslideid == slideid) {
					selectProjectorButton.addClass("active");
				}
				selectProjectors.append(selectProjectorButton);
			});
		});

		agendaTreeTable.add("slide", slideid, "slide", parentid, position, {
			"title": $("<span>"),
			"select-projectors" : selectProjectors,
			"options": $("<span>")
				.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Als nicht erledigt markieren"))
				.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Als erledigt markieren"))
				.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","In Agendaansicht verstecken"))
				.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","In Agendaansicht anzeigen"))
				.append($("<a>").attr("href", "/slides/" + slideid).append($("<i>").addClass("icon-play-circle").attr("title", "Folie öffnen")))
		});
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		agendaTreeTable.get("slide", slideid, "title").text(slide.title || "Unbenannt").toggleClass("untitled", !slide.title).unbind("click").click(function() {
			showSlideOptions(slideid, slide);
		});

		var options = agendaTreeTable.get("slide", slideid, "options");
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
		agendaTreeTable.remove("slide", slideid);
	});

	apiClient.on("initProjector", function (projectorid, projector) {
		apiClient.eachSlide(function (slideid, slide) {
			generateSelectProjectorSlideButton(projectorid, slideid, function (selectProjectorButton) {
				agendaTreeTable.get("slide", slideid, "select-projectors").append(selectProjectorButton);
			});
		});
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		$("#agenda .select-projector-" + projectorid).removeClass("active");
		agendaTreeTable.get("slide", projector.currentslideid, "select-projectors").children(".select-projector-" + projectorid).addClass("active");
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

	$("#new-slide").click(function () {
		showSlideOptions(null, {});
	});
});
