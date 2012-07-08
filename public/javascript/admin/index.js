function generateID() {
	return Math.random().toString(36).substring(2);
}

$(function () {
	$(".modal").hide()
		.on("hide", function() {
			$(this).find(".miniColors").miniColors("destroy");
		})
		.on("shown", function() {
			$(this).find("input:enabled:first").focus();
		});
});
