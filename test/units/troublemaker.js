
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class TroublemakerTest extends UnitTest {

	constructor() {
		super('Test troublemaker');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.Troublemaker.value);
		}
		for (let i = 0; i < 10; i++) {
			roles.push(Math.floor(Math.random() * (Role.enums.length - 1)) + 1);
		}

		// Create a room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		// Invoke troublemakers' skills
		const players = [];
		const exchanges = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			const auth = {id: room.id, seat, seatKey: 1};
			await this.get('role', auth);
			const player = await this.getJSON();
			players.push(player);

			if (player.role === Role.Troublemaker.value) {
				await this.post('skill', auth, {players: [1, 1]});
				await this.assertError(400, 'Invalid skill targets');

				await this.post('skill', auth, {players: [1, seat]});
				await this.assertError(400, 'Invalid skill targets');

				let exchange = null;
				do {
					exchange = [
						Math.floor(Math.random() * playerNum) + 1,
						Math.floor(Math.random() * playerNum) + 1,
					];
				} while (exchange[0] === exchange[1] || exchange.some(t => t === seat));
				console.log(`Exchange ${exchange[0]} ${exchange[1]}`);
				await this.post('skill', auth, {players: exchange});
				await this.assertOk();
				exchanges.push(exchange);
			}
		}

		// Calculate the expected result
		assert(exchanges.length > 0);
		for (const exchange of exchanges) {
			const from = players[exchange[0] - 1];
			const to = players[exchange[1] - 1];
			const fromRole = from.role;
			const toRole = to.role;
			from.role = toRole;
			to.role = fromRole;
		}

		// Vote and see lync result
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.post('lynch', {id: room.id, seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const result = await this.getJSON();

		assert(result.length > 0);
		for (const player of result) {
			const baseline = players[player.seat - 1];
			assert(baseline.role === player.role);
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = TroublemakerTest;
