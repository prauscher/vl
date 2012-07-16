// vim:noet:sw=8:

function ShowBallotList(options) {
	var ballotLists = {};

	var showBallotOptions = generateShowOptionsModal({
		modal : "#ballot",
		fields : [
			{ property : "title", field : "#title", type : "text" },
			{ property : "maxvotes", field : "#maxvotes", type : "text" },
			{ property : "status", field : "#status", type : "select" }
		],
		fillModal : function (modal, id, item) {
			$(modal).addClass("ballot-" + id);
			$(modal).find(".settings .countedvotes").val(item.countedvotes);
			$(modal).find(".addOption").unbind("click").click(function () {
				apiClient.ballotAddOption(id, generateID(), {
					title : "",
					hidden : true
				});
			});
			$(modal).find(".options").empty().sortable({
				handle : ".move",
				update : function (ev,ui) {
					var optionid = ui.item.children(".id").text();
					var position = ui.item.parent().children().index(ui.item);

					apiClient.ballotMoveOption(ballotid, optionid, position);
					return false;
				}
			});

			apiClient.registerBallot(id);
		},
		closeModal : function (modal, id, item) {
			$(modal).removeClass("ballot-" + id);
		},
		saveCallback : apiClient.saveBallot,
		deleteCallback : function (ballotid) {
			options.deleteBallot(id, ballotid);
		}
	});

	apiClient.on(options.initEvent, function (id, ballotid) {
		if (ballotLists[id]) {
			var ballotItem = $("<li>").addClass("ballot-" + ballotid)
				.append("<a>");
			ballotLists[id].append(ballotItem);

			apiClient.on("updateBallot", function (_ballotid, ballot) {
				if (ballotid == _ballotid) {
					ballotLists[id].children(".ballot-" + ballotid).unbind("click").click(function () {
						showBallotOptions(ballotid, ballot);
					});
					ballotLists[id].children(".ballot-" + ballotid).children("a").text(ballot.title);
				}
			});

			apiClient.on("deleteBallot", function (_ballotid) {
				if (ballotid == _ballotid) {
					ballotItem.remove();
				}
			});
		}
	});

	this.generateButton = function (id) {
		ballotLists[id] = $("<ul>").addClass("dropdown-menu")
			.append($("<li>").append($("<a>").text("Hinzufügen").click(function () {
				// Ballot must not be empty, else the system will think it does not exist
				options.addBallot(id, generateID(), {
					title : generateColor(),
					countedvotes : 0,
					maxvotes : 0,
					status : "preparing"
				});
			}))
			.append($("<li>").addClass("divider")) );
		options.registerBallots(id);

		return $("<span>").addClass("dropdown")
			.append($("<i>").addClass("show-ballots").addClass("icon-list").css("cursor", "pointer").attr("data-toggle", "dropdown"))
			.append(ballotLists[id]);
	}
}

$(function() {
	apiClient.on("initBallotOption", function (ballotid, optionid, position) {
		$("#ballot.ballot-" + ballotid + " .options").sortedList("add", position, $("<li>").addClass("option-" + optionid)
			.append($("<i>").addClass("icon-move").addClass("move"))
			.append($("<span>").addClass("id").hide().text(optionid))
			.append($("<input>").attr("type", "text").addClass("title"))
			.append($("<i>").addClass("isvisible").addClass("icon-eye-open").attr("title","In der Ansicht verstecken"))
			.append($("<i>").addClass("ishidden").addClass("icon-eye-close").attr("title","In der Ansicht anzeigen"))
			.append($("<i>").addClass("delete").addClass("icon-trash").attr("title","Löschen").click(function () {
				apiClient.ballotDeleteOption(ballotid, optionid);
			})) );
	});

	apiClient.on("updateOption", function (optionid, option) {
		$("#ballot .option-" + optionid + " .title").val(option.title).change(function () {
			option.title = $(this).val();
			apiClient.saveOption(optionid, option);
		});

		$("#ballot .option-" + optionid + " .isvisible").unbind("click").toggle(option.hidden != "true").click(function () {
			option.hidden = true;
			apiClient.saveOption(optionid, option);
		});
		$("#ballot .option-" + optionid + " .ishidden").unbind("click").toggle(option.hidden == "true").click(function () {
			option.hidden = false;
			apiClient.saveOption(optionid, option);
		});
	});

	apiClient.on("deleteOption", function (optionid) {
		$("#ballot .option-" + optionid).remove();
	});

	$("#ballot .options").sortedList();
});
