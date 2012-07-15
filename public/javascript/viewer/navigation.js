function goToNavigation(hash) {
	var parameters = hash.substr(1).split("-");
	configureDefaultProjector(false);
	switch (parameters.shift()) {
	case "ballot":
		configureBallot(parameters.join("-"));
		$("#projector-controls").show();
		break;
	case "election":
		configureElection(parameters.join("-"));
		$("#projector-controls").show();
		break;
	case "motion":
		configureMotion(parameters.join("-"));
		$("#projector-controls").show();
		break;
	case "slide":
		configureSlide(parameters.join("-"));
		$("#projector-controls").show();
		break;
	case "projector":
		configureProjector(parameters.join("-"));
		break;
		break;
	default:
		configureDefaultProjector(true);
		$("#projector-controls").hide();
		break;
	}
}

$(function () {
	window.onhashchange = function() {
		goToNavigation(location.hash);
	}

	goToNavigation(location.hash);
});
