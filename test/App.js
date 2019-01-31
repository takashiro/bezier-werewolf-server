
const fs = require('fs');
const util = require('util');
const readline = require('readline');
const {spawn} = require('child_process');

const writeFile = util.promisify(fs.writeFile);

class App {

	constructor(config) {
		this.config = config;
	}

	start() {
		// Write config file
		const configFile = 'test/tmp/config.json';
		return writeFile(configFile, JSON.stringify(this.config))
		.then(() => {
			// Start application
			const app = spawn('node', ['app', '--config=' + configFile]);
			this.process = app;
			return new Promise(function (resolve, reject) {
				const appout = readline.createInterface({input: app.stdout});
				appout.once('line', function (message) {
					if (message === 'started') {
						resolve();
					} else {
						reject();
					}
				});
				const apperr = readline.createInterface({input: app.stderr});
				apperr.once('line', reject);
			});
		});
	}

	stop() {
		if (this.process) {
			return this.process.kill();
		}
	}

}

module.exports = App;
