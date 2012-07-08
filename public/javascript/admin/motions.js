// vim:noet:sw=8:

function showMotionClassOptions(motionclassid, motionclass) {
	if (motionclassid == null) {
		motionclassid = generateID();
		$("#motions #motionclass-options #delete-motionclass").hide();
	} else {
		$("#motions #motionclass-options #delete-motionclass").show();
	}

	$("#motions #motionclass-options #title").val(motionclass.title);

	$("#motions #motionclass-options form").on("submit").submit(function () {
		$("#motions #motionclass-options #save-motionclass").click();
	});
	$("#motions #motionclass-options #save-motionclass").unbind("click").click(function () {
		motionclass.title = $("#motions #motionclass-options #title").val();

		apiClient.saveMotionClass(motionclassid, motionclass, function () {
			$("#motions #motionclass-options").modal("hide");
		});
	});
	$("#motions #motionclass-options #delete-motionclass").unbind("click").click(function () {
		apiClient.deleteMotionClass(motionclassid, function () {
			$("#motions #motionclass-options").modal("hide");
		});
	});

	$("#motions #motionclass-options").modal();
}

function showMotionOptions(motionid, motion) {
	if (motionid == null) {
		$("#motions #motion-options #motionid").prop("disabled", false).val("");
		$("#motions #motion-options #delete-motion").hide();
	} else {
		$("#motions #motion-options #motionid").prop("disabled", true).val(motionid);
		$("#motions #motion-options #delete-motion").show();
	}

	$("#motions #motion-options #title").val(motion.title);
	$("#motions #motion-options #submitter").val(motion.submitter);
	$("#motions #motion-options #status option").removeAttr("selected");
	$("#motions #motion-options #status option[value=" + motion.status + "]").attr("selected", "selected");
	$("#motions #motion-options #text").val(motion.text);
	$("#motions #motion-options #argumentation").val(motion.argumentation);

	$("#motions #motion-options form").unbind("submit").submit(function () {
		$("#motions #motion-options #save-motion").click();
	});
	$("#motions #motion-options #save-motion").unbind("click").click(function() {
		if (motionid == null) {
			motionid = $("#motions #motion-options #motionid").val();
		}

		motion.title = $("#motions #motion-options #title").val();
		motion.submitter = $("#motions #motion-options #submitter").val();
		motion.status = $("#motions #motion-options #status option:selected").val();
		motion.text = $("#motions #motion-options #text").val();
		motion.argumentation = $("#motions #motion-options #argumentation").val();

		apiClient.saveMotion(motionid, motion, function() {
			$("#motions #motion-options").modal('hide')
		});
	});
	$("#motions #motion-options #delete-motion").unbind("click").click(function() {
		apiClient.deleteMotion(motionid, function () {
			$("#motions #motion-options").modal('hide');
		});
	});

	$("#motions #motion-options").modal();
}

$(function () {
	var motionsTreeTable = new TreeTable("ol#motions", { disableNesting : "motion" });
	motionsTreeTable.setStyle("motionclass", "icon", {width: "20px"});
	motionsTreeTable.setStyle("motionclass", "title", {width: "350px", cursor: "pointer"});
	motionsTreeTable.setStyle("motion", "icon", {width: "20px"});
	motionsTreeTable.setStyle("motion", "title", {width: "350px", cursor: "pointer"});
	motionsTreeTable.onMove(function (id, parentid, position, type, parenttype) {
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
	});

	apiClient.on("initMotionClass", function (motionclassid, parentid, position) {
		motionsTreeTable.add("motionclass", motionclassid, "motionclass", parentid, position, {
			icon: $("<i>").addClass("icon").addClass("icon-folder-open"),
			title: $("<span>")
		});
	});

	apiClient.on("initMotion", function (motionid, classid, position) {
		motionsTreeTable.add("motion", motionid, "motionclass", classid, position, {
			icon: $("<i>").addClass("icon").addClass("icon-file"),
			title: $("<span>"),
			options: $("<span>")
				.append($("<a>").attr("href", "/motions/" + motionid).append($("<i>").addClass("icon-play-circle").attr("title", "Antrag öffnen")))
		});
	});

	apiClient.on("updateMotionClass", function (motionclassid, motionclass) {
		motionsTreeTable.get("motionclass", motionclassid, "title").text(motionclass.title).click(function () {
			showMotionClassOptions(motionclassid, motionclass);
		});
	});

	apiClient.on("updateMotion", function (motionid, motion) {
		motionsTreeTable.get("motion", motionid, "title").text(motionid + ": " + motion.title).unbind("click").click(function() {
			showMotionOptions(motionid, motion);
		});
	});

	apiClient.on("deleteMotionClass", function (motionclassid) {
		motionsTreeTable.remove("motionclass", motionclassid)
	});

	apiClient.on("deleteMotion", function (motionid) {
		motionsTreeTable.remove("motion", motionid);
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
