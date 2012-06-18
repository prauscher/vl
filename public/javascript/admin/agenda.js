var slideLatestChild = {};

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
	$("#agenda #options #save-slide").unbind("click").click(function() {
		slide.title = $("#agenda #options #title").val();
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
	apiClient.on("initSlide", function (slideid, slide) {
		if ($("#slide-" + slideid).length < 1) {
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
			var selectBeamers = $("<td>").addClass("select-beamers");
			apiClient.eachBeamer(function (beamerid, beamer) {
				generateSelectBeamerSlideButton(beamerid, slideid, function (selectBeamerButton) {
					selectBeamers.append(selectBeamerButton);
				});
			});

			insertPosition.after($("<tr>").attr("id", "slide-" + slideid)
				.append($("<td>")
					.append($("<span>").addClass("indent").html(indent))
					.append($("<i>").addClass('icon-move')) )
				.append($("<td>").addClass("title"))
				.append(selectBeamers)
				.append($("<td>")
					.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Erledigt"))
					.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Erledigt"))
					.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","Versteckt"))
					.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","Versteckt")) ) );
		}
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		$("#agenda #slide-" + slideid + " .title").text(slide.title);

		$("#agenda #slide-" + slideid + " .isundone").unbind("click").toggle(slide.isdone != "true").click(function () {
			slide.isdone = true;
			apiClient.saveSlide(slideid, slide);
		});
		$("#agenda #slide-" + slideid + " .isdone").unbind("click").toggle(slide.isdone == "true").click(function () {
			slide.isdone = false;
			apiClient.saveSlide(slideid, slide);
		});

		$("#agenda #slide-" + slideid + " .isvisible").unbind("click").toggle(slide.hidden != "true").click(function () {
			slide.hidden = true;
			apiClient.saveSlide(slideid, slide);
		});
		$("#agenda #slide-" + slideid + " .ishidden").unbind("click").toggle(slide.hidden == "true").click(function () {
			slide.hidden = false;
			apiClient.saveSlide(slideid, slide);
		});

		$("#agenda #slide-" + slideid + " .title").unbind("click").click(function() {
			showSlideOptions(slideid, slide);
		});
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#agenda #slide-" + slideid).remove();
	});

	$("#new-slide").click(function () {
		showSlideOptions(null, {});
	});
});
