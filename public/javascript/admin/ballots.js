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

	function initBallot (ballotid) {
		$("#ballot-list #ballot-list").append($("<div>").addClass("well").addClass("ballot-" + ballotid)
			.append($("<span>").addClass("close").text("×").addClass("delete"))
			.append($("<form>").addClass("form-horizontal")
				.append($("<div>").addClass("control-group")
					.append($("<label>").addClass("control-label").text("Stimmen"))
					.append($("<div>").addClass("controls")
						.append($("<input>").attr("type", "text").addClass("span1").addClass("countedvotes").prop("disabled", true))
						.append(" / ")
						.append($("<input>").attr("type", "text").addClass("span1").addClass("maxvotes"))
						.append($("<div>").addClass("progress progress-striped")
							.append($("<div>").addClass("bar").addClass("countedprogress"))) ) ) ) );
	}

	apiClient.on("updateBallot", function (ballotid, ballot) {
		$("#ballot-list #ballot-list .ballot-" + ballotid + " .delete").unbind("click").click(function () {
			if (currentMotionID != null) {
				apiClient.motionDeleteBallot(currentMotionID, ballotid);
			}
			if (currentElectionID != null) {
				apiClient.motionDeleteBallot(currentElectionID, ballotid);
			}
		});

		$("#ballot-list #ballot-list .ballot-" + ballotid + " .countedprogress").css("width", Math.floor(100 * ballot.countedvotes / ballot.maxvotes) + "%");
		$("#ballot-list #ballot-list .ballot-" + ballotid + " .countedvotes").val(ballot.countedvotes);
		$("#ballot-list #ballot-list .ballot-" + ballotid + " .maxvotes").val(ballot.maxvotes).unbind("click").change(function () {
			ballot.maxvotes = $(this).val();
			apiClient.saveBallot(ballotid, ballot);
		});
	});

	apiClient.on("deleteBallot", function (ballotid) {
		$("#ballot-list #ballot-list .ballot-" + ballotid).remove();
	});
});
