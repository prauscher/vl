function showSlideOptions(slideid, slide) {
	if (slideid == null) {
		slideid = Math.random().toString(36).replace(/[^a-zA-Z0-9]/,'').substring(0,7);
		slide.hidden = true;
		slide.isdone = false;
		$("#agenda #options #delete-slide").hide();
	} else {
		$("#agenda #options #delete-slide").show();
	}

	$("#agenda #options input#title").val(slide.title);

	$("#agenda #options #save-slide").unbind("click");
	$("#agenda #options #save-slide").click(function() {
		slide.title = $("#agenda #options #title").val();
		saveSlide(slideid, slide, function() {
			$("#agenda #options").modal('hide')
		});
	});
	$("#agenda #options #delete-slide").unbind("click");
	$("#agenda #options #delete-slide").click(function() {
		deleteSlide(slideid, function () {
			$("#agenda #options").modal('hide');
		});
	});

	$("#agenda #options").modal();
}

var agendaClient = {};

agendaClient.init = function (slideid, slide) {
	if ($("#slide-" + slideid).length < 1) {
		slides[slideid] = slide;

		var insertPosition;
		var indent = "";
		if (slide.parentid) {
			indent = $("#agenda #slide-" + slide.parentid + " .indent").html() + "&nbsp;&nbsp;";
			if (slideLatestChild[slide.parentid]) {
				insertPosition = $("#agenda #slide-" + slideLatestChild[slide.parentid]);
			} else {
				insertPosition = $("#agenda #slide-" + slide.parentid);
			}
			slideLatestChild[slide.parentid] = slideid;
		} else {
			indent = "";
			insertPosition = $("#slides tr");
		}
		var item = $("<tr>").attr("id", "slide-" + slideid);
		var selectMarker = $("<td>");
		selectMarker.append($("<span>").addClass("indent").html(indent));
		selectMarker.append($("<i>").addClass('icon-move'));
		var selectBeamers = $("<td>").addClass("select-beamers");
		for (var beamerid in beamers) {
			selectBeamers.append(beamerClient.generateSelectBeamerSlideButton(beamerid, slideid));
		}
		var options = $("<td>");
		options.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Erledigt"));
		options.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Erledigt"));
		options.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","Versteckt"));
		options.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","Versteckt"));

		item.append(selectMarker);
		item.append($("<td>").addClass("title"));
		item.append(selectBeamers);
		item.append(options);

		insertPosition.after(item);
	}
}

agendaClient.update = function (slideid, slide) {
	$("#agenda #slide-" + slideid + " .title").text(slide.title);

	$("#agenda #slide-" + slideid + " .isundone").unbind("click").toggle(slide.isdone != "true").click(function () {
		slide.isdone = true;
		saveSlide(slideid, slide);
	});
	$("#agenda #slide-" + slideid + " .isdone").unbind("click").toggle(slide.isdone == "true").click(function () {
		slide.isdone = false;
		saveSlide(slideid, slide);
	});

	$("#agenda #slide-" + slideid + " .isvisible").unbind("click").toggle(slide.hidden != "true").click(function () {
		slide.hidden = true;
		saveSlide(slideid, slide);
	});
	$("#agenda #slide-" + slideid + " .ishidden").unbind("click").toggle(slide.hidden == "true").click(function () {
		slide.hidden = false;
		saveSlide(slideid, slide);
	});

	$("#agenda #slide-" + slideid + " .title").unbind("click");
	$("#agenda #slide-" + slideid + " .title").click(function() {
		showSlideOptions(slideid, slide);
	});
}

agendaClient.delete = function (slideid) {
	$("#agenda #slide-" + slideid).remove();
}

$(function () {
	$("#new-slide").click(function () {
		showSlideOptions(null, {});
	});
});
