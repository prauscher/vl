$(function () {
	function switchNavigation(item) {
		$(".navbar .nav>li").removeClass("active");
		$(".navbar .nav>." + item).addClass("active");
		$("body>.container").hide();
		$("body>#" + item).show();
	}

	$("#nav-projectors").click(function() {
		switchNavigation("projectors");
	});
	$("#nav-agenda").click(function() {
		switchNavigation("agenda");
	});
	$("#nav-timers").click(function() {
		switchNavigation("timers");
	});
	$("#nav-motions").click(function() {
		switchNavigation("motions");
	});
	$("#nav-pollsites").click(function() {
		switchNavigation("pollsites");
	});

	if (location.hash == "#timers") {
		switchNavigation("timers");
	} else if (location.hash == "#projectors") {
		switchNavigation("projectors");
	} else if (location.hash == "#motions") {
		switchNavigation("motions");
	} else if (location.hash == "#pollsites") {
		switchNavigation("pollsites");
	} else {
		switchNavigation("agenda");
	}
});
