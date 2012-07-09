function showBallotListModal(options) {
	$("#ballot-list #ballot-list").empty();

	function initBallot (ballotid) {
		$("#ballot-list #ballot-list").append($("<div>").addClass("well").addClass("ballot-" + ballotid));
	}

	if (options.electionid) {
		apiClient.on("initElectionBallot", function (electionid, ballotid) {
			if (electionid == options.electionid) {
				initBallot(ballotid);
			}
		});
		$("#ballot-list").on("hide", function () {
			apiClient.unregisterElectionBallots(options.electionid);
		});
		apiClient.registerElectionBallots(options.electionid);
	}
	if (options.motionid) {
		apiClient.on("initMotionBallot", function (motionid, ballotid) {
			if (motionid == options.motionid) {
				initBallot(ballotid);
			}
		});
		$("#ballot-list").on("hide", function () {
			apiClient.unregisterMotionBallots(options.motionid);
		});
		apiClient.registerMotionBallots(options.motionid);
	}

	apiClient.on("updateBallot", function (ballotid, ballot) {
		
	});

	apiClient.on("deleteBallot", function (ballotid) {
		$("#ballot-list #ballot-list .ballot-" + ballotid).remove();
	});

	$("#ballot-list").modal();
}
