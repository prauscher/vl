function saveBeamer(beamerid, beamer, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/beamer/' + beamerid + "/save",
		data: { beamer : beamer },
		success: callbackSuccess
	});
}
