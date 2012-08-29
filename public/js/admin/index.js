// vim:noet:ts=4:sw=4:

model.initialize('projectors');

$(function() {
	$(".select-color").miniColors();

	$(".modal").modal().modal('hide')
		.on("shown", function() {
			$(this).find("input:enabled, textarea:enabled").first().focus();
		});

	function showTab(id) {
		$(".nav a").each(function() {
			$(this).parent().toggleClass('active', $(this).attr('href') == id);
		});
		$("section").each(function() {
			$(this).toggle($(this).attr('id') == id.substr(1));
		});
	}

	$(window).on('hashchange', function() {
		showTab(location.hash || "#agenda");
	});

	$(window).trigger('hashchange');
});
