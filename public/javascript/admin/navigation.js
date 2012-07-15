var currentlyPickedProjector = null;

function pickProjector(projectorid) {
	currentlyPickedProjector = projectorid;
	$.cookie("currentlyPickedProjector", projectorid);

	$("#showprojector li").removeClass("active");

	if (projectorid != null) {
		$(".select-projector").hide();
		$("#showprojector .select-projector").show();
		$(".select-projector-" + projectorid).show();
		$("#showprojector #showprojector-" + projectorid).addClass("active");
	} else {
		$(".select-projector").show();
	}
}

function switchNavigation(item) {
	$(".navbar .nav>li").removeClass("active");
	$(".navbar .nav>." + item).addClass("active");
	$("body>.container").hide();
	$("body>#" + item).show();
}

function goToNavigation() {
	if (location.hash == "#timers") {
		switchNavigation("timers");
	} else if (location.hash == "#projectors") {
		switchNavigation("projectors");
	} else if (location.hash == "#motions") {
		switchNavigation("motions");
	} else if (location.hash == "#pollsites") {
		switchNavigation("pollsites");
	} else if (location.hash == "#elections") {
		switchNavigation("elections");
	} else {
		switchNavigation("agenda");
	}
}

$(function () {
	window.onhashchange = goToNavigation;
	goToNavigation();

	apiClient.on("initProjector", function (projectorid, projector) {
		$("#showprojector ul").append($("<li>").attr("id", "showprojector-" + projectorid).toggleClass("active", (currentlyPickedProjector == projectorid))
			.append($("<a>")
				.append($("<img>")
					.attr("src", "/images/empty.gif")
					.addClass("select-projector")
					.addClass("active")
					.addClass("select-projector-" + projectorid) )
				.append(" ")
				.append($("<span>").addClass("title")) ) );
	});

	apiClient.on("updateProjector", function(projectorid, projector) {
		$("#showprojector #showprojector-" + projectorid).unbind("click").click(function () {
			pickProjector(projectorid);
		});
		$("#showprojector-" + projectorid + " .select-projector")
			.css("background-color", projector.color)
			.attr("title", "Projektor " + projector.title + " anzeigen");
		$("#showprojector #showprojector-" + projectorid + " .title").text(projector.title);
	});

	apiClient.on("deleteProjector", function(projectorid) {
		$("#showprojector-" + projectorid).remove();
	});

	$("#showprojectors").click(function () {
		pickProjector(null);
	});

	if ($.cookie("currentlyPickedProjector")) {
		pickProjector($.cookie("currentlyPickedProjector"));
	}

	$("#identify-projectors").click(function () {
		$.ajax({
			type: 'POST',
			url: '/identify-projectors',
			data: { timeout: 5 }
		});
	});
});
