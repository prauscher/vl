// vim:noet:sw=8:

function showSlideOptions(slideid, slide) {
	if (slideid == null) {
		slideid = generateID();
		slide.hidden = true;
		slide.isdone = false;
		slide.type = "agenda";
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

	$("#agenda #options #save-slide").unbind("click").click(function() {
		slide.title = $("#agenda #options input#title").val();

		slide.text = $("#agenda #options #slidecontent-text-text").val();
		slide.html = $("#agenda #options #slidecontent-html-html").val();
		slide.applicationid = $("#agenda #options #slidecontent-application-applicationid option:selected").val();

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
	agendaTreeTable.setStyle("slide", "title", {width: "350px"});
	agendaTreeTable.onMove(function (slideid, parentid, position) {
		if (parentid == null) {
			return false;
		} else {
			apiClient.moveSlide(slideid, parentid, position);
		}
	});

	apiClient.on("initSlide", function (slideid, parentid, position) {
		var selectBeamers = $("<span>");
		apiClient.eachBeamer(function (beamerid, beamer) {
			generateSelectBeamerSlideButton(beamerid, slideid, function (selectBeamerButton) {
				if (beamer.currentslideid == slideid) {
					selectBeamerButton.addClass("active");
				}
				selectBeamers.append(selectBeamerButton);
			});
		});

		agendaTreeTable.add("slide", slideid, "slide", parentid, position, {
			"title": $("<span>"),
			"select-beamers" : selectBeamers,
			"options": $("<span>")
				.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Als nicht erledigt markieren"))
				.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Als erledigt markieren"))
				.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","In Agendaansicht verstecken"))
				.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","In Agendaansicht anzeigen"))
				.append($("<a>").attr("href", "/slides/" + slideid).append($("<i>").addClass("icon-play-circle").attr("title", "Folie öffnen")))
		});
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		agendaTreeTable.get("slide", slideid, "title").text(slide.title).unbind("click").click(function() {
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

	apiClient.on("initBeamer", function (beamerid, beamer) {
		apiClient.eachSlide(function (slideid, slide) {
			generateSelectBeamerSlideButton(beamerid, slideid, function (selectBeamerButton) {
				agendaTreeTable.get("slide", slideid, "select-beamers").append(selectBeamerButton);
			});
		});
	});

	apiClient.on("updateBeamer", function (beamerid, beamer) {
		$("#agenda .select-beamer-" + beamerid).removeClass("active");
		agendaTreeTable.get("slide", beamer.currentslideid, "select-beamers").children(".select-beamer-" + beamerid).addClass("active");
	});

	apiClient.on("initApplication", function (applicationid, categoryid, position) {
		$("#agenda #options #slidecontent-application-applicationid").append(
			$("<option>").addClass("application-" + applicationid).attr("value", applicationid) )
	});

	apiClient.on("updateApplication", function (applicationid, application) {
		$("#agenda #options #slidecontent-application-applicationid option.application-" + applicationid).text(applicationid + ": " + application.title);
	});

	apiClient.on("deleteApplication", function (applicationid) {
		$("#agenda #options #slidecontent-application-applicationid option.application-" + applicationid).remove();
	});

	$("#new-slide").click(function () {
		showSlideOptions(null, {});
	});
});
