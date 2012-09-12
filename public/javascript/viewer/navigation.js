// vim:noet:sw=8:

function goToNavigation() {
	// Re-initialize the Interface to defaults
	configureDefaultProjector(false);
	setViewerData();

	var parameters = location.hash.substr(1).split(":");
	switch (parameters.shift()) {
	case "election":
		if (parameters.length > 1) {
			configureBallot(parameters[1]);
		} else {
			configureElection(parameters[0]);
		}
		$("#projector-controls").show();
		break;
	case "motion":
		if (parameters.length > 1) {
			configureBallot(parameters[1]);
		} else {
			configureMotion(parameters[0]);
		}
		$("#projector-controls").show();
		break;
	case "slide":
		configureSlide(parameters[0]);
		$("#projector-controls").show();
		break;
	case "projector":
		configureProjector(parameters[0]);
		break;
	default:
		configureDefaultProjector(true);
		$("#projector-controls").hide();
		break;
	}
}

$(function () {
	window.onhashchange = goToNavigation;
	goToNavigation();
});

$(function () {
	/*
	$("#options-button").properMenu();
	$("#options-button").properMenu("addItem", "projectors");
	$("#options-button").properMenu("setItem", "projectors", {
		title: "Projektor",
		href: "#"
	});
	$("#options-button").properMenu("addItem", "agenda");
	$("#options-button").properMenu("setItem", "agenda", {
		title: "Tagesordnung",
		href: "#"
	});*/

	apiClient.on("initProjector", function (projectorid, projector) {
		$("#options-button").properMenu("addItem", "projector-" + projectorid, "projectors");
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		$("#options-button").properMenu("setItem", "projector-" + projectorid, {
			hidden: projector.hidden == "true",
			title: projector.title,
			href: "#projector-" + projectorid
		});
	});

	apiClient.on("deleteProjector", function (projectorid) {
		$("#options-button").properMenu("removeItem", "projector-" + projectorid);
	});

	apiClient.registerProjectors();

	apiClient.on("initSlide", function (slideid, parentid, position) {
		$("#options-button").properMenu("addItem", "slide-" + slideid, (parentid ? "slide-" + parentid : "agenda"), position);
	});

	apiClient.on("updateSlide", function (slideid, slide) {
		$("#options-button").properMenu("setItem", "slide-" + slideid, {
			hidden: slide.hidden == "true",
			title: slide.title,
			href: "#slide-" + slideid
		});
	});

	apiClient.on("deleteSlide", function (slideid) {
		$("#options-button").properMenu("removeItem", "slide-" + slideid);
	});

	apiClient.registerAgenda();
});
