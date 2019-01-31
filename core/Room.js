
const randstr = require('../util/randstr');

/**
 * Game Room
 */
class Room {

	constructor() {
		this.id = 0;
		this.driver = null;
		this.ownerKey = randstr(32);
	}

	/**
	 * Set up a game driver
	 * @param {Engine} driver
	 */
	setDriver(driver) {
		this.driver = driver;
	}

	/**
	 * Get the game engine
	 */
	getDriver() {
		return this.driver;
	}

}

module.exports = Room;
