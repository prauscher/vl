// vim:noet:sw=8:

apiClient = new APIClient();

$(function() {
	apiClient.on("initPollsite", function(pollsiteid, pollsite) {
		$("#pollsite").append($("<option>").attr("value", pollsiteid).text(pollsiteid));
	});

	apiClient.on("deletePollsite", function(pollsiteid, pollsite) {
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

		$("#election-ballot").prop('disabled', value != "election");
		$("#motion-ballot").prop('disabled', value != "motion");

		if (value == "election") $("#election").change();
		if (value == "motion") $("#motion").change();
	});

	var electionid = null;
	var motionid = null;
	var ballotids = [];

	$("#election").change(function() {
		if (electionid)
			apiClient.unregisterElectionBallots(electionid);

		ballotids = [];
		electionid = $(this).val();
		apiClient.registerElectionBallots(electionid);
		$("#election-ballot").empty().append($("<option>").text('--').attr('value', '')).change();
	});

	$("#motion").change(function() {
		if (motionid)
			apiClient.unregisterMotionBallots(motionid);

		ballotids = [];
		motionid = $(this).val();
		apiClient.registerMotionBallots(motionid);
		$("#motion-ballot").empty().append($("<option>").text('--').attr('value', '')).change();
	});

	apiClient.on("initElectionBallot", function(electionid, ballotid) {
		$("#election-ballot").append($("<option>").attr('value', ballotid));
		ballotids.push(ballotid);
	});
	
	apiClient.on("initMotionBallot", function(motionid, ballotid) {
		$("#motion-ballot").append($("<option>").attr('value', ballotid));
		ballotids.push(ballotid);
	});

	apiClient.on("updateBallot", function(ballotid, ballot) {
		$(".select-ballot [value='" + ballotid + "']").text(ballot.title);
	});
	
	apiClient.on("deleteBallot", function(ballotid, ballot) {
		$(".select-ballot [value='" + ballotid + "']").remove();
	});

	var current_ballotid = null;

	$("#motion-ballot, #election-ballot").change(function() {
		$('#options').empty();
		current_ballotid = $(this).val();
		if (current_ballotid == '') {
			current_ballotid = null;
			return;
		}
		apiClient.eachBallotOption(current_ballotid, function(optionid, option) {
			$("#options").append($("<tr>").attr('id', 'option-' + optionid)
				.append($("<td>").text(option.title))
				.append($("<td>").append($("<input>").data('optionid', optionid))));
		});
	});

	apiClient.registerMotionClasses();
	apiClient.registerPollsites();
	apiClient.registerElections();

	$("form").submit(function() {
		$("#options input").each(function() {
			console.log();
			$.ajax({
				type: 'POST',
				url: '/votes',
				data: {
					ballotid: current_ballotid,
					optionid: $(this).data('optionid'),
					pollsiteid: $("#pollsite").val(),
					votes: $(this).val()
				}
			});
		});
		return false;
	});
});
