var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.elections, "electionid", "election");
exports.delete = backendRouter.generateDelete(backend.elections, "electionid");
