
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');
const Team = require('../../game/Team');

const isWerewolf = require('../isWerewolf');

class DreamWolfTest extends UnitTest {

	constructor() {
		super('Test dream wolf');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.DreamWolf.value);
			roles.push(Role.Werewolf.value);
		}
		for (let i = 0; i < 20; i++) {
			roles.push(Math.floor(Math.random() * (Role.enums.length - 1)) + 1);
		}

		// Create a room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		// Fetch all roles
		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			const auth = {id: room.id, seat, seatKey: 1};
			await this.get('role', auth);
			const player = await this.getJSON();
			players.push(player);
		}

		const werewolves = players
			.filter(player => isWerewolf(player.role))
			.map(player => player.seat);

		for (const player of players) {
			const auth = {id: room.id, seat: player.seat, seatKey: 1};
			await this.post('skill', auth, {});
			if (player.role === Role.Werewolf.value) {
				const vision = await this.getJSON();
				assert(werewolves.length === vision.players.length);
				for (let i = 0; i < werewolves.length; i++) {
					assert(werewolves[i] === vision.players[i].seat);
				}
			} else if (player.role === Role.DreamWolf.value) {
				await this.assertError(404, 'No skill for your role');
			}
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = DreamWolfTest;
