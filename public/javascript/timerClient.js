function TimerClient(callbacks) {
	this.timerCurrent = {};
	this.timerLastRun = {};
	this.timerTimeout = {};
	this.callbacks = callbacks;
}

TimerClient.prototype.update = function (timerid, timer) {
	this.timerCurrent[timerid] = timer.current;
	this.timerLastRun[timerid] = new Date();

	if (timerid in this.timerTimeout) {
		window.clearInterval(this.timerTimeout[timerid]);
		delete this.timerTimeout[timerid];
	}
	if (timer.running == 'true') {
		var self = this;
		this.timerTimeout[timerid] = window.setInterval(function () {
			var now = new Date();
			self.timerCurrent[timerid] -= (now.getTime() - self.timerLastRun[timerid].getTime()) / 1000;
			if (self.timerCurrent[timerid] < 0) {
				self.timerCurrent[timerid] = 0;
			}
			self.timerLastRun[timerid] = now;
			self.callbacks.countdown(timerid, self.timerCurrent[timerid]);
		}, 500);
	}
	this.callbacks.update(timerid, timer);
	this.callbacks.countdown(timerid, this.timerCurrent[timerid]);
}
