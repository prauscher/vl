var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.ballots, "ballotid", "ballot");
exports.delete = backendRouter.generateDelete(backend.ballots, "ballotid");
