// vim:noet:sw=8:

function showAppCategoryOptions(appcategoryid, appcategory) {
	if (appcategoryid == null) {
		appcategoryid = generateID();
		$("#applications #appcategory-options #delete-appcategory").hide();
	} else {
		$("#applications #appcategory-options #delete-appcategory").show();
	}

	$("#applications #appcategory-options #title").val(appcategory.title);

	$("#applications #appcategory-options #save-appcategory").unbind("click").click(function () {
		appcategory.title = $("#applications #appcategory-options #title").val();

		apiClient.saveAppCategory(appcategoryid, appcategory, function () {
			$("#applications #appcategory-options").modal("hide");
		});
	});
	$("#applications #appcategory-options #delete-appcategory").unbind("click").click(function () {
		apiClient.deleteAppCategory(appcategoryid, function () {
			$("#applications #appcategory-options").modal("hide");
		});
	});

	$("#applications #appcategory-options").modal();
}

function showApplicationOptions(applicationid, application) {
	if (applicationid == null) {
		$("#applications #application-options #applicationid").show();
		$("#applications #application-options #delete-application").hide();
	} else {
		$("#applications #application-options #applicationid").hide();
		$("#applications #application-options #delete-application").show();
	}

	$("#applications #application-options #title").val(application.title);
	$("#applications #application-options #submitter").val(application.submitter);
	$("#applications #application-options #status option").removeAttr("selected");
	$("#applications #application-options #status option[value=" + application.status + "]").attr("selected", "selected");
	$("#applications #application-options #text").val(application.text);
	$("#applications #application-options #argumentation").val(application.argumentation);

	$("#applications #application-options #save-application").unbind("click").click(function() {
		if (applicationid == null) {
			applicationid = $("#applications #application-options #applicationid").val();
		}

		application.title = $("#applications #application-options #title").val();
		application.submitter = $("#applications #application-options #submitter").val();
		application.status = $("#applications #application-options #status option:selected").val();
		application.text = $("#applications #application-options #text").val();
		application.argumentation = $("#applications #application-options #argumentation").val();

		apiClient.saveApplication(applicationid, application, function() {
			$("#applications #application-options").modal('hide')
		});
	});
	$("#applications #application-options #delete-application").unbind("click").click(function() {
		apiClient.deleteApplication(applicationid, function () {
			$("#applications #application-options").modal('hide');
		});
	});

	$("#applications #application-options").modal();
}

$(function () {
	var applicationsTreeTable = new TreeTable("ol#applications", { disableNesting : "application" });
	applicationsTreeTable.setStyle("appcategory", "icon", {width: "20px"});
	applicationsTreeTable.setStyle("appcategory", "title", {width: "350px"});
	applicationsTreeTable.setStyle("application", "icon", {width: "20px"});
	applicationsTreeTable.setStyle("application", "title", {width: "350px"});
	applicationsTreeTable.onMove(function (id, parentid, position, type, parenttype) {
		if (type == "application") {
			if (parentid == null || parenttype != "appcategory") {
				return false;
			} else {
				apiClient.moveApplication(id, parentid, position);
			}
		} else if (type == "appcategory") {
			if (parenttype != "appcategory") {
				return false;
			} else {
				apiClient.moveAppCategory(id, parentid, position);
			}
		}
	});

	apiClient.on("initAppCategory", function (appcategoryid, parentid, position) {
		applicationsTreeTable.add("appcategory", appcategoryid, "appcategory", parentid, position, {
			icon: $("<i>").addClass("icon").addClass("icon-folder-open"),
			title: $("<span>")
		});
	});

	apiClient.on("initApplication", function (applicationid, categoryid, position) {
		applicationsTreeTable.add("application", applicationid, "appcategory", categoryid, position, {
			icon: $("<i>").addClass("icon").addClass("icon-file"),
			title: $("<span>")
		});
	});

	apiClient.on("updateAppCategory", function (appcategoryid, appcategory) {
		applicationsTreeTable.get("appcategory", appcategoryid, "title").text(appcategory.title).click(function () {
			showAppCategoryOptions(appcategoryid, appcategory);
		});
	});

	apiClient.on("updateApplication", function (applicationid, application) {
		applicationsTreeTable.get("application", applicationid, "title").text(application.title).unbind("click").click(function() {
			showApplicationOptions(applicationid, application);
		});
	});

	apiClient.on("deleteAppCategory", function (appcategoryid) {
		applicationsTreeTable.remove("appcategory", appcategoryid)
	});

	apiClient.on("deleteApplication", function (applicationid) {
		applicationsTreeTable.remove("application", applicationid);
	});

	apiClient.on("initAppCategory", function (appcategoryid) {
		$(".new-application-categorys").append(
			$("<li>").addClass("appCategory-" + appcategoryid)
				.append("<a>") );
	});

	apiClient.on("updateAppCategory", function (appcategoryid, appcategory) {
		$(".appCategory-" + appcategoryid + " a").text(appcategory.title);
		$(".appCategory-" + appcategoryid).unbind("click").click(function () {
			showApplicationOptions(null, { categoryid: appcategoryid });
		});
	});

	$("#new-appcategory").click(function () {
		showAppCategoryOptions(null, {});
	});
});
