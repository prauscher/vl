// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/pollsites/:pollsiteid/save', "pollsite:save", backendRouter.generateSave(backend.pollsites, "pollsiteid", "pollsite") );
	options.post('/pollsites/:pollsiteid/delete', "pollsite:delete", backendRouter.generateDelete(backend.pollsites, "pollsiteid") );
}
