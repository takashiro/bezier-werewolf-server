
const App = require('./core/App');

// Load configurations
let config = (function () {
	try {
		return require('./config.json');
	} catch (e) {
		return {};
	}
})();

for (let argv of process.argv) {
	if (argv.startsWith('--config=')) {
		let configFile = argv.substr(9);
		config = require('./' + configFile);
	}
}

// Start up application
(async function () {
	const app = new App(config);
	try {
		await app.start();
		console.log('started');
	} catch (error) {
		console.error(error);
		return process.exit(1);
	}
})();
