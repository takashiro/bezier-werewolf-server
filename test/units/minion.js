
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

const isWerewolf = require('../isWerewolf');

class MinionTest extends UnitTest {

	constructor() {
		super('Test minion skill');
	}

	async run() {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			roles.push(Role.Werewolf.value);
			roles.push(Role.Minion.value);
		}
		for (let i = 0; i < 30; i++) {
			let role = Math.floor(Math.random() * (Role.enums.length - 1)) + 1;
			roles.push(role);
		}

		await this.post('room', {roles});
		const room = await this.getJSON();

		const werewolves = [];
		const minions = [];
		const playerNum = roles.length - 3;
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: 1});
			let my = await this.getJSON();
			if (isWerewolf(my.role) >= 0) {
				werewolves.push(seat);
			} else if (my.role === Role.Minion.value) {
				minions.push(seat);
			}
		}

		assert(werewolves.length > 0);

		for (let seat of minions) {
			await this.post('skill', {id: room.id, seat, seatKey: 1}, {});
			let vision = await this.getJSON();
			assert(vision.players.length === werewolves.length);
			for (let i = 0; i < werewolves.length; i++) {
				assert(vision.players[i].seat === werewolves[i]);
			}
		}

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = MinionTest;
