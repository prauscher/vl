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

function updateSlideData(slideid, slide) {
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

$(function () {
	$("#new-slide").click(function () {
		showSlideOptions(null, {});
	});
});
