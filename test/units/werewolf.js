
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

const Wolf = [
	Role.Werewolf.value,
	Role.AlphaWolf.value,
];

class WerewolfTest extends UnitTest {

	constructor() {
		super('Test werewolf skill');
	}

	async run() {
		const roles = [];
		for (let i = 0; i < 5; i++) {
			roles.push(Role.Werewolf.value);
		}
		for (let i = 0; i < 4; i++) {
			roles.push(Role.AlphaWolf.value);
		}
		for (let i = 0; i < 20; i++) {
			roles.push(Role.Villager.value);
		}

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
				player.vision = await this.getJSON();
			}
		}

		const wolves = players.filter(player => Wolf.indexOf(player.role) >= 0).map(player => parseInt(player.seat));
		assert(wolves.length >= 2);
		wolves.sort((a, b) => a > b);

		for (const player of players) {
			if (player.role === Role.Werewolf.value) {
				let vision = player.vision.players;
				assert(wolves.length === vision.length);
				let werewolves = vision.map(v => v.seat);
				for (let i = 0; i < wolves.length; i++) {
					assert(wolves[i] === werewolves[i]);
				}
			}
		}

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = WerewolfTest;
