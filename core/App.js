
const http = require('http');
const path = require('path');
const querystring = require('querystring');

const HttpError = require('./HttpError');
const Lobby = require('./Lobby');

const DefaultConfig = {
	socket: '/var/run/bezier-werewolf/bezier-werewolf.sock',
	maxRoomLimit: 1000,
	roomExpiry: 3600,
};

/**
 * Read an object from JSON stream
 * @param {ReadableStream} stream
 * @return {Promise<object>}
 */
function readJSON(stream) {
	return new Promise(function (resolve, reject) {
		let trunks = [];

		stream.on('data', function (trunk) {
			trunks.push(trunk);
		});

		stream.on('error', reject);

		stream.on('end', function () {
			let input = Buffer.concat(trunks).toString();
			if (input) {
				try {
					input = JSON.parse(input);
					resolve(input);
				} catch (error) {
					reject(error);
				}
			} else {
				resolve({});
			}
		});
	});
}

/**
 * Handle client requests
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
async function requestListener(request, response) {
	// Parse request URL
	let api = request.url;
	let params = {};
	let q = api.indexOf('?');
	if (q >= 0) {
		try {
			params = querystring.parse(api.substr(q + 1));
		} catch (error) {
			// Do nothing
		}
		api = api.substr(0, q);
	}

	// Load API
	let handler = null;
	try {
		handler = require(path.join('..', 'api', api));
	} catch (error) {
		response.writeHead(404);
		return response.end('No such an API');
	}

	// Call API
	let method = handler[request.method];
	if (!method) {
		response.writeHead(405);
		return response.end('Method not allowed');
	}

	try {
		let body = null;
		if (request.method === 'POST') {
			body = await readJSON(request);
		}

		let output = await method.call(this, params, body);
		if (output && output.toJSON && typeof output.toJSON === 'function') {
			output = output.toJSON();
		}

		if (output) {
			response.writeHead(200);
			response.end(JSON.stringify(output));
		} else {
			response.writeHead(200);
			response.end();
		}
	} catch (error) {
		if (error instanceof HttpError) {
			response.writeHead(error.code);
			return response.end(error.message);
		} else {
			console.error(error);
			response.writeHead(500);
			return response.end(String(error));
		}
	}
}

/**
 * Application of Avalon Node.js Server
 */
class App {

	/**
	 * Construct a server application
	 * @param {object} config
	 */
	constructor(config = {}) {
		this.config = {
			...DefaultConfig,
			...config,
		};

		this.lobby = new Lobby(this.config.roomExpiry * 1000, this.config.maxRoomLimit);
		this.server = http.createServer(requestListener.bind(this));
	}

	/**
	 * Start the application
	 * @return {Promise}
	 */
	start() {
		return new Promise((resolve, reject) => {
			this.server.listen(this.config.socket, resolve);
		});
	}

	/**
	 * Stop the application
	 * @return {Promise}
	 */
	stop() {
		return new Promise((resolve, reject) => {
			this.server.close(resolve);
		});
	}

	/**
	 * Get the instance of game lobby
	 * @return {Lobby}
	 */
	getLobby() {
		return this.lobby;
	}

	/**
	 * Get the server address
	 */
	getAddress() {
		return this.server.address();
	}

	/**
	 * Get the server port
	 */
	getPort() {
		return this.server.address().port;
	}

}

module.exports = App;
