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
		// register for ballots here
	});

	$("#motion").change(function() {
		if (motionid) {
			apiClient.unregisterMotionBallots(motionid);
		}
		$(ballotids).each(function(idx, value) {
			apiClient.unregisterBallot(value);
		});
		ballotids = [];
		motionid = $(this).val();
		apiClient.registerMotionBallots(motionid);
		$("motion-ballot").empty().change();
	});

	apiClient.on("initElectionBallot", function(electionid, ballotid) {
		$("#election-ballot").append($("<option>").attr('value', ballotid));
		ballotids.push(ballotid);
		apiClient.registerBallot(ballotid);
	});
	
	apiClient.on("initMotionBallot", function(motionid, ballotid) {
		$("#motion-ballot").append($("<option>").attr('value', ballotid));
		ballotids.push(ballotid);
		apiClient.registerBallot(ballotid);
	});

	apiClient.on("updateBallot", function(ballotid, ballot) {
		$(".select-ballot [value='" + ballotid + "']").text(ballot.title);
	});
	
	apiClient.on("deleteBallot", function(ballotid, ballot) {
		$(".select-ballot [value='" + ballotid + "']").remove();
	});

	var ballotid = null;

	$("#election-ballot").change(function() {
	});

	$("#motion-ballot").change(function() {
		if (ballotid) {
			apiClient.eachBallotOption(ballotid, function(optionid) {
				apiClient.unregisterOption(optionid);
			});
		}
		$('#options').empty();
		ballotid = $(this).val();
		apiClient.eachBallotOption(ballotid, function(optionid) {
			apiClient.registerOption(optionid);
		});
	});

	apiClient.on("initBallotOption", function(ballotid, optionid) {
		$("#options").append($("<tr>").attr('id', 'option-' + optionid)
			.append($("<td>").addClass('title'))
			.append($("<td>").addClass('results').append($("<input>"))));
	});

	apiClient.on("updateOption", function(optionid, option) {
		$("#options tr#option-" + optionid).toggle(option.hidden != "false");
		$("#options tr#option-" + optionid + " td.title").text(option.title);
	});
	
	apiClient.on("deleteOption", function(optionid) {
		$("#options tr#option-" + optionid).remove();
	});

	apiClient.registerMotionClasses();
	apiClient.registerPollsites();
	apiClient.registerElections();
});
