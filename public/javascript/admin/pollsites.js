function showPollsiteOptions(pollsiteid, pollsite) {
	if (pollsiteid == null) {
		$("#pollsites #pollsite-options #pollsiteid").prop("disabled", false).val("");
		$("#pollsites #pollsite-options #delete-pollsite").hide();
	} else {
		$("#pollsites #pollsite-options #pollsiteid").prop("disabled", true).val(pollsiteid);
		$("#pollsites #pollsite-options #delete-pollsite").show();
	}

	$("#pollsites #pollsite-options #password").val(pollsite.password);
	$("#pollsites #pollsite-options #maxvotes").val(pollsite.maxvotes);

	$("#pollsites #pollsite-options form").unbind("submit").submit(function () {
		$("#pollsites #pollsite-options #save-pollsite").click();
	});
	$("#pollsites #pollsite-options #save-pollsite").unbind("click").click(function () {
		if (pollsiteid == null) {
			pollsiteid = $("#pollsites #pollsite-options #pollsiteid").val();
		}

		pollsite.password = $("#pollsites #pollsite-options #password").val();
		pollsite.maxvotes = $("#pollsites #pollsite-options #maxvotes").val();

		apiClient.savePollsite(pollsiteid, pollsite, function () {
			$("#pollsites #pollsite-options").modal('hide');
		});
	});
	$("#pollsites #pollsite-options #delete-pollsite").unbind("click").click(function () {
		apiClient.deletePollsite(pollsiteid, function () {
			$("#pollsites #pollsite-options").modal('hide');
		});
	});

	$("#pollsites #pollsite-options").on("shown", function() {
		$("#pollsites #pollsite-options #pollsiteid").focus();
	});
	$("#pollsites #pollsite-options").modal();
}

$(function () {
	apiClient.on("updatePollsite", function (pollsiteid, pollsite) {
		$("#pollsites #pollsite-" + pollsiteid + " .pollsiteid").text(pollsiteid);

		$("#pollsites #pollsite-" + pollsiteid + " .pollsiteid").unbind("click").css("cursor", "pointer").click(function () {
			showPollsiteOptions(pollsiteid, pollsite);
		});
	});

	apiClient.on("initPollsite", function (pollsiteid, pollsite) {
		alert(pollsiteid);
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
