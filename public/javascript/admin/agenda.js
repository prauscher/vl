// vim:noet:sw=8:

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
			// callback here
			if (! ui.item.parent().hasClass("slide-children")) {
				// Something went wrong. mostly, the user has moved to root layer
				return false;
			} else {
				var slideid = ui.item.attr("id").split('-',2)[1];
				var parentid = ui.item.parent().parent().attr("id").split('-',2)[1];
				var position = ui.item.index();

				apiClient.moveSlide(slideid, parentid, position);
			}
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
				if (beamer.currentslideid == slideid) {
					selectBeamerButton.addClass("active");
				}
				selectBeamers.append(selectBeamerButton);
			});
		});

		parentElement.append($("<li>").attr("id", "slide-" + slideid)
			.append($('<div>').addClass("slide")
				.append($("<span>").addClass("move")
					.append($("<i>").addClass('icon-move')) )
				.append($("<span>").addClass("title"))
				.append(selectBeamers)
				.append($("<span>").addClass("options")
					.append($("<i>").addClass("isdone").addClass("icon-ok-circle").attr("title","Erledigt"))
					.append($("<i>").addClass("isundone").addClass("icon-ok-circle").attr("title","Erledigt"))
					.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","Versteckt"))
					.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","Versteckt"))
					.append($("<a>").attr("href", "/slides/" + slideid).append($("<i>").addClass("icon-play-circle"))) ))
			.append($('<ol>').addClass("slide-children")) );

	});

	apiClient.on("updateSlide", function (slideid, slide) {
		$("#agenda #slide-" + slideid + ">.slide .title").text(slide.title);

		$("#agenda #slide-" + slideid + ">.slide .isundone").unbind("click").toggle(slide.isdone != "true").click(function () {
			slide.isdone = true;
			apiClient.saveSlide(slideid, slide);
		});
		$("#agenda #slide-" + slideid + ">.slide .isdone").unbind("click").toggle(slide.isdone == "true").click(function () {
			slide.isdone = false;
			apiClient.saveSlide(slideid, slide);
		});

		$("#agenda #slide-" + slideid + ">.slide .isvisible").unbind("click").toggle(slide.hidden != "true").click(function () {
			slide.hidden = true;
			apiClient.saveSlide(slideid, slide);
		});
		$("#agenda #slide-" + slideid + ">.slide .ishidden").unbind("click").toggle(slide.hidden == "true").click(function () {
			slide.hidden = false;
			apiClient.saveSlide(slideid, slide);
		});

		$("#agenda #slide-" + slideid + ">.slide .title").unbind("click").click(function() {
			showSlideOptions(slideid, slide);
		});
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#agenda #slide-" + slideid).remove();
	});

	apiClient.on("initBeamer", function (beamerid, beamer) {
		apiClient.eachSlide(function (slideid, slide) {
			generateSelectBeamerSlideButton(beamerid, slideid, function (selectBeamerButton) {
				$("#agenda #slide-" + slideid + " .select-beamers").append(selectBeamerButton);
			});
		});
	});

	apiClient.on("updateBeamer", function (beamerid, beamer) {
		$("#agenda .select-beamer-" + beamerid).removeClass("active");
		$("#agenda #slide-" + beamer.currentslideid + ">div>.select-beamers>.select-beamer-" + beamerid).addClass("active");
	});

	$("#new-slide").click(function () {
		showSlideOptions(null, {});
	});
});
