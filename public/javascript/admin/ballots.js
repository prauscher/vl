var showBallotListModal = null;

$(function () {
	var currentElectionID = null;
	var currentMotionID = null;

	showBallotListModal = function (options) {
		$("#ballot-list #ballot-list").empty();

		if (options.electionid) {
			$("#ballot-list").on("hide", function () {
				apiClient.unregisterElectionBallots(options.electionid);
				currentElectionID = null;
			});
			apiClient.registerElectionBallots(options.electionid);
			currentElectionID = options.electionid;
			$("#ballot-list #new-ballot").unbind("click").click(function () {
				apiClient.electionAddBallot(options.electionid, generateID(), {});
			});
		}
		if (options.motionid) {
			$("#ballot-list").on("hide", function () {
				apiClient.unregisterMotionBallots(options.motionid);
				currentMotionID = null;
			});
			apiClient.registerMotionBallots(options.motionid);
			currentMotionID = options.motionid;
			$("#ballot-list #new-ballot").unbind("click").click(function () {
				apiClient.motionAddBallot(options.motionid, generateID(), {});
			});
		}

		$("#ballot-list").modal();
	}

	function initBallot (ballotid) {
		$("#ballot-list #ballot-list").append($("<div>").addClass("well").addClass("ballot-" + ballotid));
	}

	apiClient.on("initElectionBallot", function (electionid, ballotid) {
		if (electionid == currentElectionID) {
			initBallot(ballotid);
		}
	});

	apiClient.on("initMotionBallot", function (motionid, ballotid) {
		if (motionid == currentMotionID) {
			initBallot(ballotid);
		}
	});

	apiClient.on("updateBallot", function (ballotid, ballot) {
		$("#ballot-list #ballot-list .ballot-" + ballotid).text(ballot.maxvotes);
	});

	apiClient.on("deleteBallot", function (ballotid) {
		$("#ballot-list #ballot-list .ballot-" + ballotid).remove();
	});
});
