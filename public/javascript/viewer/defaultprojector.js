function configureDefaultProjector(useDefaultProjector) {
	if (!useDefaultProjector) {
		apiClient.unregisterDefaultProjector();
	}
	configureProjector();
	if (useDefaultProjector) {
		alert("muh");
		resetView();
		apiClient.registerDefaultProjector();
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
