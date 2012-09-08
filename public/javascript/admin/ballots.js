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
				$(modal).find(".show-votes").unbind('click').click(function() {
					var tbody = $("#votes tbody");
					tbody.find("tr").remove();
					apiClient.eachPollsite(function(pollsiteid, pollsite) {
						tbody.append($("<tr>").addClass('pollsite-' + pollsiteid).append($("<th>").text(pollsiteid)));
					});

					var thead_tr = $("#votes thead tr");
					thead_tr.find("th").remove();
					apiClient.eachBallotOption(id, function(optionid, option) {
						thead_tr.append($("<th>").text(option.title));
						tbody.find("tr").append($("<td>").addClass('option-' + optionid));
					});

					apiClient.registerVotes(id);

					$("#votes").data('ballotid', id).modal().on('hidden', function() {
						apiClient.unregisterVotes(id);
					});
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
			var elem = $("<li>").append($("<a>"));
			ballotLists[id].sortedList("add", ballotid, elem);

			apiClient.on("updateBallot", function (_ballotid, ballot) {
				if (ballotid == _ballotid) {
					ballotLists[id].sortedList("get", ballotid)
						.unbind("click")
						.click(function () {
							showBallotOptions(ballotid, ballot);
						});
					ballotLists[id].sortedList("get", ballotid).children("a")
						.text(ballot.title)
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
			.append($("<li>").append($("<a>").text("Wahlgang hinzufügen").click(function () {
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

		return $("<span>").addClass("dropdown").attr('title', 'Wahlgänge')
			.append($("<i>").addClass("show-ballots").addClass("icon-list").css("cursor", "pointer").attr("data-toggle", "dropdown"))
			.append(ballotLists[id]);
	}
}

$(function() {
	apiClient.on("initBallotOption", function (ballotid, optionid, position) {
		$("#ballot.ballot-" + ballotid + " .options").sortedList("add", "option-" + optionid, position, $("<li>")
			.append($("<i>").addClass("icon-move").addClass("move"))
			.append($("<span>").addClass("id").hide().text(optionid))
			.append($("<input>").attr("type", "text").addClass("title").attr('placeholder', "Name"))
			.append($("<input>").attr("type", "text").addClass("link").attr('placeholder', "URL"))
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
		$("#ballot .options").sortedList("get", "option-" + optionid).find(".link").val(option.link).change(function () {
			option.link = $(this).val();
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

	apiClient.on("votesSet", function(ballotid, optionid, pollsiteid, votes) {
		if ($("#votes").data('ballotid') != ballotid) return;

		$("#votes tbody tr.pollsite-" + pollsiteid + " td.option-" + optionid).text(votes);
	});
});
