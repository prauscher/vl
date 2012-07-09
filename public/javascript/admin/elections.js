// vim:noet:sw=8:

$(function () {
	var showElectionOptions = generateShowOptionsModal({
		modal : "#elections #election-options",
		fields : [
			{ property : "title", field : "#title", type : "text" }
		],
		saveCallback : apiClient.saveElection,
		deleteCallback : apiClient.deleteElection
	});

	apiClient.on("initElection", function (electionid) {
		$("#elections #elections").append($("<tr>").attr("id", "election-" + electionid)
			.append($("<td>").addClass("title"))
			.append($("<td>").addClass("options")
				.append($("<a>").attr("href", "/elections/" + electionid).append($("<i>").addClass("icon-play-circle").attr("title", "Wahl anzeigen"))) ));
	});

	apiClient.on("updateElection", function (electionid, election) {
		$("#elections #election-" + electionid + " .title").text(election.title);

		$("#elections #election-" + electionid + " .title").unbind("click").css("cursor", "pointer").click(function () {
			showElectionOptions(electionid, election);
		});
	});

	apiClient.on("deleteElection", function (electionid) {
		$("#election-" + electionid).remove();
	});

	$("#new-election").click(function () {
		showElectionOptions(null, {
			color : generateColor()
		});
	});
});
