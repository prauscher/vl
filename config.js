var fs = require('fs');

if (process.argv.length < 3) {
	console.error("Please provide the config file name as a command line parameter!");
	process.exit(1);
}

module.exports = JSON.parse(fs.readFileSync(process.argv[2]));
