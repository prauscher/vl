// vim:noet:sw=8:

var currentMotionID = null;

function configureMotion(motionid) {
	if (motionid != currentMotionID) {
		if (currentMotionID != null) {
			apiClient.unregisterMotion(currentMotionID);
			currentMotionID = null;
		}
		if (motionid) {
			resetView();
			apiClient.registerMotion(motionid);
			currentMotionID = motionid;
		}
	}
}

$(function () {
	apiClient.on('error:motionNotFound', function (motionid) {
		if (motionid == currentMotionID) {
			showError("Der Antrag wurde nicht gefunden");
		}
	});

	apiClient.on("updateMotion", function (motionid, motion) {
		if (motionid == currentMotionID) {
			showView("motion", { motionid: motionid, motion: motion });
		}
	});
});
