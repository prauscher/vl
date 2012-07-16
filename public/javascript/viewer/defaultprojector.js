// vim:noet:sw=8:

var currentUseDefaultProjector = false;

function configureDefaultProjector(useDefaultProjector) {
	if (useDefaultProjector != currentUseDefaultProjector) {
		if (!useDefaultProjector) {
			apiClient.unregisterDefaultProjector();
			currentUseDefaultProjector = false;
		}
		configureProjector();
		if (useDefaultProjector) {
			resetView();
			apiClient.registerDefaultProjector();
			currentUseDefaultProjector = true;
		}
	}
}

$(function () {
	apiClient.on("setDefaultProjector", function (projectorid) {
		if (projectorid) {
			configureProjector(projectorid);
		} else {
			showError("Kein Projector als Default gesetzt");
		}
	});
});
