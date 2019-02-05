
const UnitTest = require('../UnitTest');

class StatusTest extends UnitTest {

	constructor() {
		super('Test status');
	}

	async run() {
		await this.get('status');
		await this.assertJSON({
			roomNum: 0,
			roomNumLimit: 10,
		});
	}

}

module.exports = StatusTest;
