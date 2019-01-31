
const HttpClient = require('./test/HttpClient');

const config = {
	socket: {
		host: 'localhost',
		port: 10000 + Math.floor(Math.random() * 55536),
	},
	maxRoomLimit: 10
};

(async function () {
	let localDebug = process.argv.some(arg => arg === '--local-debug');

	// Start application
	const App = require(localDebug ? './core/App' : './test/App');
	let app = new App(config);
	await app.start();

	// Run tests
	const client = new HttpClient(config.socket.port);
	const tests = require('./test/units');

	let failures = 0;
	for (let UnitTest of tests) {
		let test = new UnitTest;
		console.log(`--- ${test.name} ---`);
		test.setClient(client);
		try {
			await test.run();
			console.log('--- Passed ---');
		} catch (error) {
			console.log('--- Failed ---');
			console.error(error);
			failures++;
		}

		console.log('');
	}

	console.log(`Result: ${tests.length - failures} / ${tests.length}`);

	// Close application
	app.stop();

	return process.exit(failures ? 1 : 0);
})();
