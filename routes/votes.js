// vim:noet:sw=8:

exports.setVotes = function (req, res) {
	backend.votes.setVotes(req.params.ballotid, req.body.optionid, req.body.pollsiteid, req.body.votes, function () {
		res.send(200);
	});
}
