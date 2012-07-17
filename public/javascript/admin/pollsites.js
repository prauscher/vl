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
		$("#pollsites tbody").sortedList("get", pollsiteid).find(".pollsiteid")
			.text(pollsiteid)
			.css("cursor", "pointer")
			.unbind("click")
			.click(function () {
				showPollsiteOptions(pollsiteid, pollsite);
			});
	});

	apiClient.on("initPollsite", function (pollsiteid, pollsite) {
		$("#pollsites tbody").sortedList("add", pollsiteid, $("<tr>")
			.append($("<td>").addClass("pollsiteid")) );
	});

	apiClient.on("deletePollsite", function (pollsiteid) {
		$("#pollsites tbody").sortedList("remove", pollsiteid);
	});

	$("#pollsites tbody").sortedList();

	$("#new-pollsite").click(function () {
		showPollsiteOptions(null, {});
	});
});
