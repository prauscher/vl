function numberLines(text) {
	var lines = text.split("\n");
	var tag = $("<ol>").addClass("line-numbers");
	$.each(lines, function(idx, line) {
		tag.append($("<li>").append($("<span>").text(line)));
	});
	return tag;
}

function resetView() {
	if ($("#error").is(":visible")) {
		$("#error").hide();
		$("#waiting").show();
	}
}

function clearView() {
	$('#content .content-text').hide();
	$('#content .content-html').hide();
	$('#content .content-agenda').hide();
	$('#content .content-motion').hide();
	$('#content .content-election').hide();
	$('#content .content-ballot').hide();
}

function showView(type, options) {
	clearView();

	$("#error").hide();
	$("#waiting").fadeOut(300);

	$('#title').text(options.title);

	if (type == "text") {
		$('#content .content-text').text(options.text).show();
	}
	if (type == "html") {
		$('#content .content-html').html(options.html).show();
	}
	if (type == "agenda") {
		$('#content .content-agenda').show();
	}
	if (type == "motion") {
		$('#title').text(options.motion.title);
		$(".motionid").text(options.motionid);
		$(".motion-text").empty().append(numberLines(options.motion.text));
		$(".motion-argumentation").text(options.motion.argumentation);
		$(".motion-submitter").text(options.motion.submitter);
		$(".motion-status *").hide();
		$(".motion-status .status-" + options.motion.status).show();
		$('#content .content-motion').show();
	}
	if (type == "election") {
		$('#title').text(options.election.title);
		$('#content .content-election').show();
	}
	if (type == "ballot") {
		$('.ballot-maxvotes').text(options.ballot.maxvotes);
		$('.ballot-status *').hide();
		$('.ballot-status .status-' + options.ballot.status).show();
		$('#content .content-ballot').show();
	}
}

function showError(message, notes) {
	$("#error .message").text(message);
	$("#error .notes").text(notes);
	$("#error").show();
	$("#waiting").hide();
}

$(function () {
	clearView();
});
