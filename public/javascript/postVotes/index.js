// vim:noet:sw=8:

apiClient = new APIClient();

$(function() {
	apiClient.on("initPollsite", function(pollsiteid, pollsite) {
		$("#pollsite").append($("<option>").attr("value", pollsiteid).text(pollsiteid));
	});

	apiClient.on("deletePollsite", function(pollsiteid, pollsite) {
		console.log(pollsiteid);
		$("#pollsite").children("option[value='" + pollsiteid + "']").remove();
	});


	// Motions

	apiClient.on("initMotion", function(motionid) {
		$("#motion").append($("<option>").attr("value", motionid));
	});

	apiClient.on("updateMotion", function(motionid, motion) {
		$("#motion").children("option[value='" + motionid + "']").text(motion.title);
	});

	apiClient.on("deleteMotion", function(motionid) {
		$("#motion").children("option[value='" + motionid + "']").remove();
	});


	// Elections

	apiClient.on("initElection", function(electionid) {
		$("#election").append($("<option>").attr("value", electionid));
	});

	apiClient.on("updateElection", function(electionid, election) {
		$("#election").children("option[value='" + electionid + "']").text(election.title);
	});

	apiClient.on("deleteElection", function(electionid) {
		$("#motions").children("option[value='" + electionid + "']").remove();
	});


	// Ballots

	apiClient.on("initMotionBallot", function(motionid, ballotid) {
		$("#ballot").append($("<option>").attr("value", ballotid));
	});

	apiClient.on("initElectionBallot", function(electionid, ballotid) {
		$("#ballot").append($("<option>").attr("value", ballotid));
	});

	apiClient.on("updateBallot", function(ballotid, ballot) {
		$("#ballot").children("option[value='" + ballotid + "']").text(ballot.title);
	});

	apiClient.on("deleteBallot", function(ballodid) {
		$("#ballot").children("option[value='" + ballotid + "']").remove();
	});


	// actions

	$("input[name='select-type']").change(function() {
		var value = $("input[name='select-type']:checked").val();
		$("#election").prop('disabled', value != "election");
		$("#motion").prop('disabled', value != "motion");

		if (value == "election") $("#election").change();
		if (value == "motion") $("#motion").change();
	});

	$("#election").change(function() {
		// register for ballots here
		console.log($(this).val());
	});

	$("#motion").change(function() {
		// register for ballots here
		console.log($(this).val());
	});

	apiClient.registerMotionClasses();
	apiClient.registerPollsites();
	apiClient.registerElections();
});
