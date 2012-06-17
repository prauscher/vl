function saveSlide(slideid, slide, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/agenda/' + slideid + '/save',
		data: { slide : slide },
		success: callbackSuccess
	});
}

function deleteSlide(slideid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/agenda/' + slideid + '/delete',
		success: callbackSuccess
	});
}
