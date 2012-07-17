// vim:noet:sw=8:

function ShowBallotList(options) {
	var ballotLists = {};

	function generateShowBallotOptions(id) {
		return generateShowOptionsModal({
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
			addCallback : function (ballotid, ballot) {
			},
			saveCallback : apiClient.saveBallot,
			deleteCallback : function (ballotid, callback) {
				options.deleteBallot(id, ballotid, callback);
			}
		});
	}

	apiClient.on(options.initEvent, function (id, ballotid) {
		var showBallotOptions = generateShowBallotOptions(id);
		if (ballotLists[id]) {
			ballotLists[id].sortedList("add", ballotid, $("<li>").append($("<a>")));

			apiClient.on("updateBallot", function (_ballotid, ballot) {
				if (ballotid == _ballotid) {
					ballotLists[id].sortedList("get", ballotid).unbind("click").click(function () {
						showBallotOptions(ballotid, ballot);
					});
					ballotLists[id].sortedList("get", ballotid).children("a").text(ballot.title);
				}
			});

			apiClient.on("deleteBallot", function (_ballotid) {
				if (ballotid == _ballotid) {
					ballotLists[id].sortedList("remove", ballotid);
				}
			});
		}
	});

	this.generateButton = function (id) {
		var showBallotOptions = generateShowBallotOptions(id);
		ballotLists[id] = $("<ul>").addClass("dropdown-menu").sortedList()
			.append($("<li>").append($("<a>").text("Hinzufügen").click(function () {
				var ballotid = generateID();
				var ballot = {
					countedvotes : 0,
					maxvotes : 0,
					status : "preparing"
				};
				options.addBallot(id, ballotid, ballot);
				showBallotOptions(ballotid, ballot);
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
		$("#ballot.ballot-" + ballotid + " .options").sortedList("add", "option-" + optionid, position, $("<li>")
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
		$("#ballot .options").sortedList("get", "option-" + optionid).find(".title").val(option.title).change(function () {
			option.title = $(this).val();
			apiClient.saveOption(optionid, option);
		});

		$("#ballot .options").sortedList("get", "option-" + optionid).find(".isvisible").unbind("click").toggle(option.hidden != "true").click(function () {
			option.hidden = true;
			apiClient.saveOption(optionid, option);
		});
		$("#ballot .options").sortedList("get", "option-" + optionid).find(".ishidden").unbind("click").toggle(option.hidden == "true").click(function () {
			option.hidden = false;
			apiClient.saveOption(optionid, option);
		});
	});

	apiClient.on("deleteOption", function (optionid) {
		$("#ballot .options").sortedList("remove", "option-" + optionid);
	});

	$("#ballot .options").sortedList();
});
