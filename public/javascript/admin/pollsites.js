// vim:noet:sw=8:

$(function () {
	var showPollsiteOptions = generateShowOptionsModal({
		modal : "#pollsites #pollsite-options",
		idfield : "#pollsiteid",
		fields : [
			{ property : "password", field : "#password", type : "text" },
			{ property : "maxvotes", field : "#maxvotes", type : "text" }
		],
		saveCallback : apiClient.savePollsite,
		deleteCallback : apiClient.deletePollsite
	});

	apiClient.on("updatePollsite", function (pollsiteid, pollsite) {
		$("#pollsites #pollsite-" + pollsiteid + " .pollsiteid").text(pollsiteid);

		$("#pollsites #pollsite-" + pollsiteid + " .pollsiteid").unbind("click").css("cursor", "pointer").click(function () {
			showPollsiteOptions(pollsiteid, pollsite);
		});
	});

	apiClient.on("initPollsite", function (pollsiteid, pollsite) {
		$("#pollsites #pollsites").append($("<tr>").attr("id", "pollsite-" + pollsiteid)
			.append($("<td>").addClass("pollsiteid")) );
	});

	apiClient.on("deletePollsite", function (pollsiteid) {
		$("#pollsite-" + pollsiteid).remove();
	});

	$("#new-pollsite").click(function () {
		showPollsiteOptions(null, {});
	});
});
