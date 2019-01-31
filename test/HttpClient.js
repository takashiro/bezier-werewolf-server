
const http = require('http');
const querystring = require('querystring');

function request(method, api, params, data) {
	let path = '/' + api;
	if (params) {
		path += '?' + querystring.stringify(params);
	}
	let port = this.port;

	return new Promise(function (resolve, reject) {
		let request = http.request({
			method: method,
			port: port,
			path: path,
		}, function (res) {
			if (res) {
				resolve(res);
			} else {
				reject();
			}
		});

		request.on('error', reject);

		request.end(data && JSON.stringify(data));
	});
}

class HttpClient {

	constructor(port) {
		this.port = port;
	}

	post(api, params, input) {
		if (input === undefined) {
			return this.request('POST', api, null, arguments[1]);
		} else {
			return this.request('POST', api, arguments[1], arguments[2]);
		}
	}

	get(api, params) {
		return this.request('GET', api, params);
	}

	delete(api, params) {
		return this.request('DELETE', api, params);
	}

	request(method, api, params, data) {
		return request.call(this, method, api, params, data);
	}
}

module.exports = HttpClient;
