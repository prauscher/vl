$(function () {
	function switchNavigation(item) {
		$(".navbar .nav>li").removeClass("active");
		$(".navbar .nav>." + item).addClass("active");
		$("body>.container").hide();
		$("body>#" + item).show();
	}

	$("#nav-beamers").click(function() {
		switchNavigation("beamers");
	});
	$("#nav-agenda").click(function() {
		switchNavigation("agenda");
	});
	$("#nav-timers").click(function() {
		switchNavigation("timers");
	});
	$("#nav-applications").click(function() {
		switchNavigation("applications");
	});
	$("#nav-pollsites").click(function() {
		switchNavigation("pollsites");
	});

	if (location.hash == "#timers") {
		switchNavigation("timers");
	} else if (location.hash == "#beamers") {
		switchNavigation("beamers");
	} else if (location.hash == "#applications") {
		switchNavigation("applications");
	} else if (location.hash == "#pollsites") {
		switchNavigation("pollsites");
	} else {
		switchNavigation("agenda");
	}
});
