// vim:noet:sw=8:

$(function () {
	// Do not provide apiClient.(un)?register... directly, as this will lead to broken this-pointers in apiClient
	var ballotList = new ShowBallotList({
		initEvent : "initElectionBallot",
		registerBallots : function (id) {
			apiClient.registerElectionBallots(id);
		},
		unregisterBallots : function (id) {
			apiClient.unregisterElectionBallots(id);
		},
		addBallot : apiClient.electionAddBallot,
		deleteBallot : apiClient.electionDeleteBallot
	});

	var showElectionOptions = generateShowOptionsModal({
		modal : "#elections #election-options",
		fields : [
			{ property : "title", field : "#title", type : "text" }
		],
		saveCallback : apiClient.saveElection,
		deleteCallback : apiClient.deleteElection
	});

	apiClient.on("initElection", function (electionid) {
		$("#elections tbody").sortedList("add", electionid, $("<tr>").attr("id", "election-" + electionid)
			.append($("<td>").addClass("title").css("cursor", "pointer"))
			.append($("<td>").addClass("options")
				.append(ballotList.generateButton(electionid))));
//				.append($("<a>").attr("href", "/projector#election:" + electionid).append($("<i>").addClass("icon-play-circle").attr("title", "Wahl anzeigen"))) ) );
	});

	apiClient.on("updateElection", function (electionid, election) {
		$("#elections tbody").sortedList("get", electionid).find(".title")
			.text(election.title)
			.unbind("click")
			.click(function () {
				showElectionOptions(electionid, election);
			});
	});

	apiClient.on("deleteElection", function (electionid) {
		$("#elections tbody").sortedList("remove", electionid);
	});

	$("#elections tbody").sortedList();

	$("#new-election").click(function () {
		showElectionOptions(null, {
			color : generateColor()
		});
	});
});
