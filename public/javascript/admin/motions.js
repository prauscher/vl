// vim:noet:sw=8:

$(function () {
	var showMotionClassOptions = generateShowOptionsModal({
		modal : "#motions #motionclass-options",
		fields: [
			{ property : "title", field : "#title", type : "text" }
		],
		saveCallback : apiClient.saveMotionClass,
		deleteCallback : apiClient.deleteMotionClass
	});

	var showMotionOptions = generateShowOptionsModal({
		modal : "#motions #motion-options",
		idfield : "#motionid",
		fields : [
			{ property : "title", field : "#title", type : "text" },
			{ property : "submitter", field : "#submitter", type : "text" },
			{ property : "status", field : "#status", type : "text" },
			{ property : "text", field : "#text", type : "text" },
			{ property : "argumentation", field : "argumentation", type : "text" }
		],
		saveCallback : apiClient.saveMotion,
		deleteCallback : apiClient.deleteMotion
	});

	$("ol#motions").treeTable({
		styles: {
			motionclass: { icon: {width: "20px"}, title: {width: "350px", cursor: "pointer"} },
			motion: {icon: {width: "20px"}, title: {width: "350px", cursor: "pointer"} }
		},
		move: function (id, parentid, position, type, parenttype) {
			if (type == "motion") {
				if (parentid == null || parenttype != "motionclass") {
					return false;
				} else {
					apiClient.moveMotion(id, parentid, position);
				}
			} else if (type == "motionclass") {
				if (parenttype != null && parenttype != "motionclass") {
					return false;
				} else {
					apiClient.moveMotionClass(id, (parentid ? parentid : undefined), position);
				}
			}
		}
	});

	apiClient.on("initMotionClass", function (motionclassid, parentid, position) {
		$("ol#motions").treeTable("add", "motionclass", motionclassid, "motionclass", parentid, position, {
			icon: $("<i>").addClass("icon").addClass("icon-folder-open"),
			title: $("<span>")
		});
	});

	apiClient.on("initMotion", function (motionid, classid, position) {
		$("ol#motions").treeTable("add", "motion", motionid, "motionclass", classid, position, {
			icon: $("<i>").addClass("icon").addClass("icon-file"),
			title: $("<span>"),
			options: $("<span>")
				.append($("<i>").addClass("show-ballots").addClass("icon-list").css("cursor", "pointer"))
				.append($("<a>").attr("href", "/motions/" + motionid).append($("<i>").addClass("icon-play-circle").attr("title", "Antrag öffnen")))
		});
	});

	apiClient.on("updateMotionClass", function (motionclassid, motionclass) {
		$("ol#motions").treeTable("get", "motionclass", motionclassid, "title").text(motionclass.title).click(function () {
			showMotionClassOptions(motionclassid, motionclass);
		});
	});

	apiClient.on("updateMotion", function (motionid, motion) {
		$("ol#motions").treeTable("get", "motion", motionid, "options").children(".show-ballots").unbind("click").click(function() {
			showBallotListModal({ motionid : motionid });
		});
		$("ol#motions").treeTable("get", "motion", motionid, "title").text(motionid + ": " + motion.title).unbind("click").click(function() {
			showMotionOptions(motionid, motion);
		});
	});

	apiClient.on("deleteMotionClass", function (motionclassid) {
		$("ol#motions").treeTable("remove", "motionclass", motionclassid)
	});

	apiClient.on("deleteMotion", function (motionid) {
		$("ol#motions").treeTable("remove", "motion", motionid);
	});

	apiClient.on("initMotionClass", function (motionclassid) {
		$(".new-motion-classes").append(
			$("<li>").addClass("motionClass-" + motionclassid)
				.append("<a>") );
	});

	apiClient.on("updateMotionClass", function (motionclassid, motionclass) {
		$(".motionClass-" + motionclassid + " a").text(motionclass.title);
		$(".motionClass-" + motionclassid).unbind("click").click(function () {
			showMotionOptions(null, { classid: motionclassid });
		});
	});

	apiClient.on("deleteMotionClass", function (motionclassid) {
		$(".motionClass-" + motionclassid).remove();
	});

	$("#new-motionclass").click(function () {
		showMotionClassOptions(null, {});
	});
});
