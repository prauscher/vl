function TimerClient(apiClient) {
	this.timerCurrent = {};
	this.timerLastRun = {};
	this.timerTimeout = {};

	var self = this;

	apiClient.on("updateTimer", function (timerid, timer) {
		self.timerCurrent[timerid] = timer.current;
		self.timerLastRun[timerid] = new Date();

		if (timerid in self.timerTimeout) {
			window.clearInterval(self.timerTimeout[timerid]);
			delete self.timerTimeout[timerid];
		}
		if (timer.running == 'true') {
			self.timerTimeout[timerid] = window.setInterval(function () {
				var now = new Date();
				self.timerCurrent[timerid] -= (now.getTime() - self.timerLastRun[timerid].getTime()) / 1000;
				if (self.timerCurrent[timerid] < 0) {
					self.timerCurrent[timerid] = 0;
				}
				self.timerLastRun[timerid] = now;
				apiClient.callCallback("countdownTimer", [ timerid, self.timerCurrent[timerid] ] );
			}, 500);
		}

		apiClient.callCallback("countdownTimer", [ timerid, self.timerCurrent[timerid] ] );
	});
}

var formatTime = function (time) {
	var seconds = Math.floor(time % 60);
	var minutes = Math.floor(time / 60);
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return minutes + ":" + seconds;
}
