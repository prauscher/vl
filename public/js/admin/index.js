// vim:noet:ts=4:sw=4:

$(function() {
	$(".modal").hide()
		.on("hide", function() {
			$(this).find(".miniColors").miniColors("destroy");
		})
		.on("shown", function() {
			$(this).find("input:enabled, textarea:enabled").first().focus();
		});

	$(".modal form").unbind("submit").submit(function() {
		$(this).parent().find(".save").click();
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
