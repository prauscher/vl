// vim:noet:sw=8:

function resetView() {
	if ($("#error").is(":visible")) {
		$("#error").hide();
		$("#waiting").show();
	}
	$("#timers").empty();
}

function showView() {
	$("#error").hide();
	$("#waiting").fadeOut(300);
}

function showError(message, notes) {
	$("#error .message").text(message);
	$("#error .notes").text(notes);
	$("#error").show();
	$("#waiting").hide();
}

$(function () {
	resetView();
	$("#identify").hide();
});
