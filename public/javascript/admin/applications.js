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
	$('ol#applications').nestedSortable({
		handle: '.icon-move',
	        toleranceElement: '> div',
	        items: 'li',
		disableNesting: 'application',
		update: function(ev, ui) {
			if (ui.item.hasClass("application")) {
				if (ui.item.parent().hasClass("ui-sortable")) {
					// We do not want to put applications to the root layer
					return false;
				} else {
					var applicationid = ui.item.attr("id").split('-',2)[1];
					var categoryid = ui.item.parent().parent().attr("id").split('-',2)[1];
					var position = ui.item.index(".application");
					apiClient.moveApplication(applicationid, categoryid, position);
				}
			} else {
				var appcategoryid = ui.item.attr("id").split('-',2)[1];
				var parentid = ui.item.parent().parent().attr("id").split('-',2)[1];
				var position = ui.item.index();
				apiClient.moveAppCategory(appcategoryid, parentid, position);
			}
		}
	});

	// Note: The <ol> for children will be removed and recreated by jQuery. Do _not_ add classes to them!

	apiClient.on("initAppCategory", function (appcategoryid, parentid, position) {
		var item = $("<li>").attr("id", "appcategory-" + appcategoryid)
			.append($('<div>').addClass("appcategory")
				.append($("<span>").addClass("move")
					.append($("<i>").addClass('icon-move')) )
				.append($("<span>").addClass("title"))
				.append($("<span>").addClass("fixFloat")) );

		if (parentid != null) {
			if ($('#appcategory-' + parentid + ' > ol').length < 1) {
				$('#appcategory-' + parentid).append($("<ol>"));
			}
			if (position == 0) {
				$('#appcategory-' + parentid + ' > ol').prepend(item);
			} else {
				$('#appcategory-' + parentid + ' > ol > li:eq(' + (position - 1) + ')').after(item);
			}
		} else {
			if (position == 0) {
				$('ol#applications').prepend(item);
			} else {
				$('ol#applications > li:eq(' + (position - 1) + ')').after(item);
			}
		}
	});

	apiClient.on("initApplication", function (applicationid, categoryid, position) {
		var item = $("<li>").attr("id", "application-" + applicationid).addClass("application")
			.append($('<div>').addClass("application")
				.append($("<span>").addClass("move")
					.append($("<i>").addClass('icon-move')) )
				.append($("<span>").addClass("title"))
				.append($("<span>").addClass("fixFloat")) );

		if ($('#appcategory-' + categoryid + ' > ol').length < 1) {
			$('#appcategory-' + categoryid).append($("<ol>"));
		}
		if (position == 0) {
			$('#appcategory-' + categoryid + ' > ol').prepend(item);
		} else {
			$('#appcategory-' + categoryid + ' > ol > li.application:eq(' + (position - 1) + ')').after(item);
		}
	});

	apiClient.on("updateAppCategory", function (appcategoryid, appcategory) {
		$("#applications #appcategory-" + appcategoryid + " > .appcategory .title").text(appcategory.title);

		$("#applications #appcategory-" + appcategoryid + " > .appcategory .title").unbind("click").click(function() {
			showAppCategoryOptions(appcategoryid, appcategory);
		});
	});

	apiClient.on("updateApplication", function (applicationid, application) {
		$("#applications #application-" + applicationid + " > .application .title").text(application.title);

		$("#applications #application-" + applicationid + " > .application .title").unbind("click").click(function() {
			showApplicationOptions(applicationid, application);
		});
	});

	apiClient.on("deleteAppCategory", function (appcategoryid) {
		$("#applications #appcategory-" + appcategoryid).remove();
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
