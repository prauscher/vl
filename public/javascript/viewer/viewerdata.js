// vim:noet:sw=8:

var projectorZoom = 1;
var projectorScroll = 0;

function setViewerData(zoom, scroll) {
	if (!zoom) {
		zoom = 1;
	}
	projectorZoom = zoom;

	if (!scroll) {
		scroll = 0;
	}
	projectorScroll = scroll;

	$("#projector-controls").viewerOptions({
		zoom: zoom,
		scroll: scroll,
		callback: setViewerData
	});

	$("#content").stop().animate({
		fontSize: zoom + "em",
		marginTop: (scroll * 3) + "em"
	}, 500);
}

$(function () {
	setViewerData();
});
