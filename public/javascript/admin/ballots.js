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
				// Ballot must not be empty, else the system will think it does not exist
				apiClient.electionAddBallot(options.electionid, generateID(), {
					countedvotes : 0,
					maxvotes : 0
				});
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
				// Ballot must not be empty, else the system will think it does not exist
				apiClient.motionAddBallot(options.motionid, generateID(), {
					countedvotes : 0,
					maxvotes : 0
				});
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
