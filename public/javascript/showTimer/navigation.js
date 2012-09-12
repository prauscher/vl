// vim:noet:sw=8:

function goToNavigation() {
	// Re-initialize the Interface to defaults
	configureDefaultProjector(false);
	resetView();

	var parameters = location.hash.substr(1).split(":");
	switch (parameters.shift()) {
	case "projector":
		configureProjector(parameters[0]);
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
