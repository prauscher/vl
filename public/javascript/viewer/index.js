// vim:noet:sw=8:

function numberLines(text) {
	// Append a whitespace. When .line is empty, it will show two linenumbers in one line
	var lines = text.split("\n");
	var tag = $("<div>").addClass("line-numbers");
	$.each(lines, function(idx, line) {
		tag.append($("<div>")
			.append($("<span>").addClass("number").text(idx+1))
			.append($("<span>").addClass("line").html(line || "&nbsp;")) );
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
		$(".motion-argumentation").html(options.motion.argumentation);
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
		$('#title').text(options.ballot.title);
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
	$("#identify").hide();
	$("#connection-lost").hide();

	apiClient.on('reconnect', function() {
		location.reload();
	});

	apiClient.on('lostConnection', function() {
		$("#connection-lost").text('check net').show();
	});

});
