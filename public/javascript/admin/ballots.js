function initBallot (ballotid, deleteCall) {
	var item = $("<div>").addClass("well").addClass("ballot-" + ballotid)
		.append($("<span>").addClass("close").text("×").addClass("delete").click(deleteCall))
		.append($("<form>").addClass("form-horizontal")
			.append($("<div>").addClass("control-group")
				.append($("<label>").addClass("control-label").text("Stimmen"))
				.append($("<div>").addClass("controls")
					.append($("<input>").attr("type", "text").addClass("span1").addClass("countedvotes").prop("disabled", true))
					.append(" / ")
					.append($("<input>").attr("type", "text").addClass("span1").addClass("maxvotes")) ) ) )
		.append($("<button>").addClass("btn btn-success btn-mini").addClass("addOption").text("Option hinzufügen").click(function () {
			apiClient.ballotAddOption(ballotid, generateID(), { title : prompt(), hidden : true });
		}))
		.append($("<ol>").addClass("options").sortable({
			handle : ".move",
			update : function (ev,ui) {
				var optionid = ui.item.children(".id").text();
				var position = ui.item.parent().children().index(ui.item);

				apiClient.ballotMoveOption(ballotid, optionid, position);
				return false;
			}
		}));
	$("#ballot-list #ballot-list").append(item);
}

function generateShowBallotList (options) {
	var currentID = null;

	apiClient.on(options.initEvent, function (id, ballotid) {
		if (id == currentID) {
			initBallot(ballotid, function () {
				options.deleteBallot(id, ballotid);
			});
		}
	});

	return function (id) {
		$("#ballot-list #ballot-list").empty();

		$("#ballot-list").on("hide", function () {
			options.unregisterBallots(id);
			currentID = null;
		});
		options.registerBallots(id);
		currentID = id;
		$("#ballot-list #new-ballot").unbind("click").click(function () {
			// Ballot must not be empty, else the system will think it does not exist
			options.addBallot(id, generateID(), {
				countedvotes : 0,
				maxvotes : 0
			});
		});

		$("#ballot-list").modal();
	}
}

$(function () {
	apiClient.on("initBallotOption", function (ballotid, optionid, position) {
		var item = $("<li>").addClass("option-" + optionid)
			.append($("<i>").addClass("icon-move").addClass("move"))
			.append($("<span>").addClass("id").hide().text(optionid))
			.append($("<input>").attr("type", "text").addClass("title"))
			.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","In der Ansicht verstecken"))
			.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","In der Ansicht anzeigen"))
			.append($("<i>").addClass("delete").addClass("icon-trash").attr("title","Löschen").click(function () {
				apiClient.ballotDeleteOption(ballotid, optionid);
			}));

		if (position == 0) {
			$("#ballot-list #ballot-list .ballot-" + ballotid + " .options").prepend(item);
		} else {
			$("#ballot-list #ballot-list .ballot-" + ballotid + " .options li:eq(" + (position-1) + ")").after(item);
		}
	});

	apiClient.on("updateOption", function (optionid, option) {
		$("#ballot-list #ballot-list .option-" + optionid + " .title").val(option.title).change(function () {
			option.title = $(this).val();
			apiClient.saveOption(optionid, option);
		});

		$("#ballot-list #ballot-list .option-" + optionid + " .isvisible").unbind("click").toggle(option.hidden != "true").click(function () {
			option.hidden = true;
			apiClient.saveOption(optionid, option);
		});
		$("#ballot-list #ballot-list .option-" + optionid + " .ishidden").unbind("click").toggle(option.hidden == "true").click(function () {
			option.hidden = false;
			apiClient.saveOption(optionid, option);
		});
	});

	apiClient.on("deleteOption", function (optionid) {
		$("#ballot-list #ballot-list .option-" + optionid).remove();
	});

	apiClient.on("updateBallot", function (ballotid, ballot) {
		$("#ballot-list #ballot-list .ballot-" + ballotid + " .countedprogress").css("width", Math.floor(100 * ballot.countedvotes / ballot.maxvotes) + "%");
		$("#ballot-list #ballot-list .ballot-" + ballotid + " .countedvotes").val(ballot.countedvotes);
		$("#ballot-list #ballot-list .ballot-" + ballotid + " .maxvotes").val(ballot.maxvotes).unbind("click").change(function () {
			ballot.maxvotes = $(this).val();
			apiClient.saveBallot(ballotid, ballot);
		});
	});

	apiClient.on("deleteBallot", function (ballotid) {
		$("#ballot-list #ballot-list .ballot-" + ballotid).remove();
	});
});
