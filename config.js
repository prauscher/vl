var fs = require('fs');

if (process.argv.length < 3) {
	console.error("Please provide the config file name as a command line parameter!");
	process.exit(1);
}

var config = JSON.parse(fs.readFileSync(process.argv[2]));

for (k in config)
    exports[k] = config[k];
