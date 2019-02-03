
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class VillagerTest extends UnitTest {

	constructor() {
		super('Test villager');
	}

	async run() {
		let roles = [Role.Werewolf, Role.Villager, Role.Villager, Role.Villager, Role.Villager];
		roles = roles.map(role => role.toNum());
		await this.post('room', {roles});
		const room = await this.getJSON();

		for (let seat = 1; seat <= 2; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: seat});
			const my = await this.getJSON();
			if (my.role !== Role.Villager.value) {
				continue;
			}

			console.log('Test Villager ' + seat);
			await this.post('skill', {id: room.id, seat, seatKey: seat}, {});
			await this.assertError(404, 'No skill for your role');
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = VillagerTest;
