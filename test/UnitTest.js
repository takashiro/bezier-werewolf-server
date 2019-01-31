
const assert = require('assert');

const readText = require('./readText');

class UnitTest {

	/**
	 * Create a unit test
	 * @param {string} name
	 */
	constructor(name) {
		this.name = name;
		this.client = null;
		this.res = null;
	}

	/**
	 * Set up HTTP client
	 * @param {HttpClient} client
	 */
	setClient(client) {
		this.client = client;
	}

	/**
	 * Tests to be run.
	 * Override this function to customize tests
	 */
	run() {
	}

	async post(api, params, input) {
		this.res = await this.client.post(api, params, input);
	}

	async get(api, params) {
		this.res = await this.client.get(api, params);
	}

	async delete(api, params) {
		this.res = await this.client.delete(api, params);
	}

	/**
	 * Get JSON response from the server
	 * @return {Promise<*>}
	 */
	async getJSON() {
		let resCode = this.res.statusCode;
		let resText = await readText(this.res);
		if (this.res.statusCode !== 200) {
			assert.fail(`Unexpected: ${resCode} ${resText}`);
		}
		return JSON.parse(resText);
	}

	/**
	 * Assert JSON response values
	 * @param {*} expected
	 */
	async assertJSON(expected) {
		let actual = await this.getJSON();
		assert.deepStrictEqual(actual, expected);
	}

	/**
	 * Assert an error from an incoming message
	 * @param {number} code
	 * @param {string} message
	 * @return {Promise}
	 */
	async assertError(code, message) {
		let resCode = this.res.statusCode;
		let resText = await readText(this.res);
		if (resCode !== code || resText !== message) {
			assert.fail(`Unexpected Error: ${resCode} ${resText}`);
		}
	}

}

module.exports = UnitTest;
