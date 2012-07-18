// vim:noet:sw=8:

var currentBallotID = null;

function configureBallot(ballotid) {
	if (ballotid != currentBallotID) {
		if (currentBallotID != null) {
			apiClient.unregisterBallot(currentBallotID);
			currentBallotID = null;
		}
		if (ballotid) {
			resetView();
			$('#content .ballot-options').empty();
			apiClient.registerBallot(ballotid);
			currentBallotID = ballotid;
		}
	}
}

$(function () {
	apiClient.on('error:ballotNotFound', function (ballotid) {
		if (ballotid == currentBallotID) {
			showError("Der Wahlgang wurde nicht gefunden");
		}
	});

	apiClient.on("updateBallot", function (ballotid, ballot) {
		if (ballotid == currentBallotID) {
			showView("ballot", { ballotid: ballotid, ballot: ballot });
		}
	});

	apiClient.on("initBallotOption", function (ballotid, optionid, position) {
		if (ballotid == currentBallotID) {
			$(".ballot-options").sortedList("add", "option-" + optionid, position, $("<li>").append($("<span>").addClass("title")));
		}
	});

	apiClient.on("updateOption", function (optionid, option) {
		$(".ballot-options").sortedList("get", "option-" + optionid).toggle(option.hidden != "true")
		$(".ballot-options").sortedList("get", "option-" + optionid).find(".title").text(option.title);
	});

	apiClient.on("deleteOption", function (optionid) {
		$(".ballot-options").sortedList("remove", "option-" + optionid);
	});

	$(".ballot-options").sortedList();
});
