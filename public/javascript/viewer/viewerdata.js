var projectorScroll = 0;
var projectorZoom = 1;

function setViewerData(scroll, zoom) {
	projectorScroll = scroll;
	projectorZoom = zoom;

	$("#content").stop().animate({
		fontSize: zoom + "em",
		marginTop: (scroll * 3) + "em"
	}, 500);
}

$(function () {
	$("#projector-reset").click(function() {
		setViewerData(0, 1);
	});
	$("#projector-zoom-in").click(function () {
		setViewerData(projectorScroll, projectorZoom * 1.1);
	});
	$("#projector-zoom-out").click(function () {
		setViewerData(projectorScroll, projectorZoom / 1.1);
	});
	$("#projector-scroll-up").click(function () {
		setViewerData(projectorScroll - 1, projectorZoom);
	});
	$("#projector-scroll-down").click(function () {
		setViewerData(projectorScroll + 1, projectorZoom);
	});
});