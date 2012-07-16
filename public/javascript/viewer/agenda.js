var currentSlideID = null;

function configureSlide(slideid) {
	if (slideid != currentSlideID) {
		if (currentSlideID != null) {
			apiClient.unregisterSlide(currentSlideID);
			currentSlideID = null;
		}
		configureMotion();
		configureElection();
		configureBallot();
		if (slideid) {
			resetView();
			$('#content .content-agenda').empty();
			apiClient.registerSlide(slideid, 1);
			currentSlideID = slideid;
		}
	}
}

$(function () {
	apiClient.on('error:slideNotFound', function (slideid) {
		if (slideid == currentSlideID) {
			showError("Die Folie wurde nicht gefunden");
		}
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		if (slideid == currentSlideID) {
			switch (slide.type) {
			case 'text':
				showView("text", { title: slide.title, text: slide.text });
				break;
			case 'html':
				showView("html", { title: slide.title, html: slide.html });
				break;
			case 'agenda':
				showView("agenda", { title: slide.title });
				break;
			case 'motion':
				configureMotion(slide.motionid);
				break;
			case 'election':
				configureElection(slide.electionid);
				break;
			case 'ballot':
				configureBallot(slide.ballotid);
				break;
			}
		}
	});

	/** slidetype "agenda" **/

	apiClient.on("initSlide", function (slideid, parentid, position) {
		if (parentid == currentSlideID) {
			$("#content .content-agenda").sortedList("add", position, $("<li>").attr("id", "agenda-" + slideid));
		}
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		$("#content .content-agenda #agenda-" + slideid)
			.text(slide.title)
			.toggleClass("done", slide.isdone == "true")
			.toggle(slide.hidden != "true");
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#content .content-agenda #agenda-" + slideid).remove();
	});

	$("#content .content-agenda").sortedList();
});
