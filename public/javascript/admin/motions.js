// vim:noet:sw=8:

$(function () {
	// Do not provide apiClient.(un)?register... directly, as this will lead to broken this-pointers in apiClient
	var ballotList = new ShowBallotList({
		initEvent : "initMotionBallot",
		registerBallots : function (id) {
			apiClient.registerMotionBallots(id);
		},
		unregisterBallots : function (id) {
			apiClient.unregisterMotionBallots(id)
		},
		addBallot : apiClient.motionAddBallot,
		deleteBallot : apiClient.motionDeleteBallot
	});

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
			{ property : "status", field : "#status", type : "select" },
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
		}
	});
	$("ol#motions").treeTable("onMove", "motion", "motionclass", function (motionid, classid, position) {
		apiClient.moveMotion(motionid, classid, position);
	});
	$("ol#motions").treeTable("onMove", "motionclass", ["motionclass", null], function (classid, parentid, position) {
		apiClient.moveMotionClass(classid, (parentid ? parentid : undefined), position);
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
				.append(ballotList.generateButton(motionid))
				.append($("<a>").attr("href", "/projector#motion-" + motionid).append($("<i>").addClass("icon-play-circle").attr("title", "Antrag öffnen")))
		});
	});

	apiClient.on("updateMotionClass", function (motionclassid, motionclass) {
		$("ol#motions").treeTable("get", "motionclass", motionclassid, "title").text(motionclass.title).click(function () {
			showMotionClassOptions(motionclassid, motionclass);
		});
	});

	apiClient.on("updateMotion", function (motionid, motion) {
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
		$(".new-motion-classes").sortedList("add", motionclassid, $("<li>").append("<a>") );
	});

	apiClient.on("updateMotionClass", function (motionclassid, motionclass) {
		$(".new-motion-classes").sortedList("get", motionclassid)
			.unbind("click")
			.click(function () {
				showMotionOptions(null, { classid: motionclassid });
			})
			.find("a").text(motionclass.title);
	});

	apiClient.on("deleteMotionClass", function (motionclassid) {
		$(".new-motion-classes").sortedList("remove", motionclassid);
	});

	$(".new-motion-classes").sortedList();

	$("#new-motionclass").click(function () {
		showMotionClassOptions(null, {});
	});
});
