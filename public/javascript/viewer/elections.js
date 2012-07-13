var currentElectionID = null;

function configureElection(electionid) {
	if (electionid != currentElectionID) {
		if (currentElectionID != null) {
			apiClient.unregisterElection(currentElectionID);
			currentElectionID = null;
		}
		if (electionid) {
			resetView();
			apiClient.registerElection(electionid);
			currentElectionID = electionid;
		}
	}
}

$(function () {
	apiClient.on('error:electionNotFound', function (electionid) {
		if (electionid == currentElectionID) {
			showError("Die Wahl wurde nicht gefunden");
		}
	});

	apiClient.on("updateElection", function (electionid, election) {
		if (electionid == currentElectionID) {
			showView("election", { electionid: electionid, election: election });
		}
	});
});
