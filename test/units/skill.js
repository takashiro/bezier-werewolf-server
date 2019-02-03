
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class SkillTest extends UnitTest {

	constructor() {
		super('Test common skill inputs');
	}

	async run() {
		let roles = [Role.Villager, Role.Villager, Role.Villager, Role.Villager, Role.Villager];
		roles = roles.map(role => role.toNum());
		await this.post('room', {roles});
		const room = await this.getJSON();

		await this.post('skill');
		await this.assertError(400, 'Invalid room id');

		await this.post('skill', {id: 'test'}, {});
		await this.assertError(400, 'Invalid room id');

		await this.post('skill', {id: room.id}, {});
		await this.assertError(400, 'Invalid seat number');

		await this.post('skill', {id: room.id, seat: 1}, {});
		await this.assertError(400, 'Invalid seat key');

		await this.post('skill', {id: room.id, seat: 1, seatKey: 1}, {});
		await this.assertError(403, 'The seat has not been taken');

		await this.post('skill', {id: room.id, seat: roles.length - 2, seatKey: 1}, {});
		await this.assertError(404, 'The seat does not exist');

		for (let seat = 1; seat <= 2; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: seat});
			await this.getJSON();

			await this.post('skill', {id: room.id, seat, seatKey: 0}, {});
			await this.assertError(403, 'Invalid seat key');

			await this.post('skill', {id: room.id, seat, seatKey: seat}, {});
			await this.assertError(404, 'No skill for your role');
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = SkillTest;
