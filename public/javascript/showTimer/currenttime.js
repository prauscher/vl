// vim:noet:sw=8:

function updateCurrentTime() {
	var now = new Date();
	var hours = now.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var minutes = now.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	$("#currentTime .timer").text("⌚ " + hours + ":" + minutes);
}

$(function () {
	updateCurrentTime();
	window.setInterval(updateCurrentTime, 1000);
});
