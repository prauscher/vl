// vim:noet:sw=8:

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
				if (slide.motionBallotid && slide.motionBallotid != "") {
					configureBallot(slide.motionBallotid);
				} else {
					configureMotion(slide.motionid);
				}
				break;
			case 'election':
				if (slide.electionBallotid && slide.electionBallotid != "") {
					configureBallot(slide.electionBallotid);
				} else {
					configureElection(slide.electionid);
				}
				break;
			}
		}
	});

	/** slidetype "agenda" **/

	apiClient.on("initSlide", function (slideid, parentid, position) {
		if (parentid == currentSlideID) {
			$("#content .content-agenda").sortedList("add", "agenda-" + slideid, position, $("<li>").append( $("<a>").attr("href", "#slide:" + slideid) ));
		}
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		$("#content .content-agenda").sortedList("get", "agenda-" + slideid).children("a")
			.text(slide.title)
			.toggleClass("done", slide.isdone == "true")
			.toggle(slide.hidden != "true");
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#content .content-agenda").sortedList("remove", "agenda-" + slideid);
	});

	$("#content .content-agenda").sortedList();
});
