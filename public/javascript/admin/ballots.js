function initBallot (ballotid, deleteCall) {
	$("#ballot-list #ballot-list").append($("<div>").addClass("well").addClass("ballot-" + ballotid)
		.append($("<span>").addClass("close").text("×").addClass("delete").click(deleteCall))
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

function generateShowBallotList (options) {
	apiClient.on(options.initEvent, function (id, ballotid) {
		initBallot(ballotid, function () {
			options.deleteBallot(id, ballotid);
		});
	});

	return function (id) {
		$("#ballot-list #ballot-list").empty();

		$("#ballot-list").on("hide", function () {
			options.unregisterBallots(id);
		});
		options.registerBallots(id);
		$("#ballot-list #new-ballot").unbind("click").click(function () {
			// Ballot must not be empty, else the system will think it does not exist
			options.addBallot(id, generateID(), {
				countedvotes : 0,
				maxvotes : 0
			});
		});

		$("#ballot-list").modal();
	}
}

$(function () {
	apiClient.on("updateBallot", function (ballotid, ballot) {
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
