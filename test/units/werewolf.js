
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class WerewolfTest extends UnitTest {

	constructor() {
		super('Test werewolf skill');
	}

	async run() {
		let roles = [Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.Villager];
		roles = roles.map(role => role.toNum());
		await this.post('room', {roles});
		const room = await this.getJSON();

		const playerNum = roles.length - 3;
		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: seat});
			const player = await this.getJSON();
			players.push(player);

			if (player.role === Role.Werewolf.value) {
				await this.post('skill', {id: room.id, seat, seatKey: seat}, {});
				player.werewolves = await this.getJSON();
			}
		}

		const wolves = players.filter(player => player.role === Role.Werewolf.value).map(player => player.seat);
		assert(wolves.length >= 2);
		wolves.sort();

		for (const player of players) {
			if (player.role === Role.Werewolf.value) {
				let vision = player.werewolves;
				assert(wolves.length === vision.length + 1);
				let werewolves = [player.seat, ...vision];
				werewolves.sort();
				for (let i = 0; i < wolves.length; i++) {
					assert(wolves[i] === werewolves[i]);
				}
			} else {
				assert(!player.werewolves);
			}
		}

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = WerewolfTest;
