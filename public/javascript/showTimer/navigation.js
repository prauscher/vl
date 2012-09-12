// vim:noet:sw=8:

function goToNavigation() {
	// Re-initialize the Interface to defaults
	configureDefaultProjector(false);
	configureTimer();
	resetView();

	var parameters = location.hash.substr(1).split(":");
	switch (parameters.shift()) {
	case "projector":
		configureProjector(parameters[0]);
		break;
	case "timer":
		configureTimer(parameters[0]);
		break;
	default:
		configureDefaultProjector(true);
		break;
	}
}

$(function () {
	window.onhashchange = goToNavigation;
	goToNavigation();
});
