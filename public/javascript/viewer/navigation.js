$(function () {
	var parameters = location.hash.substr(1).split("-");
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
});
