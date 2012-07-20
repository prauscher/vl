// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js'),
    ClassesModule = require('./classes.js');

module.exports = function (options) {
	var self = this;
	this.socket = options.addSocket("/motions", "motions", require("./socket.js").apply(this));
	this.backend = require("./backend.js").apply(this);

	options.put('/motions/:motionid/save', "motions:save", backendRouter.generateSave(this.backend, "motionid", "motion") );
	options.post('/motions/:motionid/move', "motions:move", backendRouter.generateMove(this.backend, "motionid", "classid", "position") );
	options.post('/motions/:motionid/delete', "motions:delete", backendRouter.generateDelete(this.backend, "motionid") );

	options.put('/motions/:motionid/addBallot', "motions:ballots", function (req, res) {
		self.backend.addBallot(req.params.motionid, req.body.ballotid, req.body.ballot, function() {
			res.send(200);
		});
	});

	options.post('/motions/:motionid/deleteBallot', "motions:ballots", function (req, res) {
		self.backend.deleteBallot(req.params.motionid, req.body.ballotid, function () {
			res.send(200);
		});
	});

	this.classes = new ClassesModule(options);
}
