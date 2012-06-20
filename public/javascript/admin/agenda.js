// vim:noet:sw=8:

var slideLatestChild = {};

function showSlideOptions(slideid, slide) {
	if (slideid == null) {
		slideid = Math.random().toString(36).replace(/[^a-zA-Z0-9]/,'').substring(0,7);
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

	$('ol#slides').nestedSortable({
		handle: '.icon-move',
	        items: 'li',
	        toleranceElement: '> div',
		update: function(ev, ui) {
			ui.item.effect('highlight');
			// callback here
		}
	});

	apiClient.on("initSlide", function (slideid, slide) {

		var parentElement;

		if (slide.parentid) {
			parentElement = $('#slide-' + slide.parentid + ' > ol');
		} else {
			parentElement = $("ol#slides");
		}

		var selectBeamers = $("<span>").addClass("select-beamers");
		apiClient.eachBeamer(function (beamerid, beamer) {
			generateSelectBeamerSlideButton(beamerid, slideid, function (selectBeamerButton) {
				selectBeamers.append(selectBeamerButton);
			});
		});

		parentElement.append($("<li>").attr("id", "slide-" + slideid)
			.append($('<div>')
				.append($("<span>")
					.append($("<i>").addClass('icon-move')) )
				.append($("<span>").addClass("title"))
				.append(selectBeamers)
				.append($("<span>")
					.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Erledigt"))
					.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Erledigt"))
					.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","Versteckt"))
					.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","Versteckt"))
					.append($("<a>").attr("href", "/slides/" + slideid).append($("<i>").addClass("icon-play-circle"))) ))
			.append($('<ol>')) );

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
