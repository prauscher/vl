function saveTimer(timerid, timer, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/timers/' + timerid + '/save',
		data: { timer : timer },
		success: callbackSuccess
	});
}

function deleteTimer(timerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/timers/' + timerid + '/delete',
		success: callbackSuccess
	});
}
