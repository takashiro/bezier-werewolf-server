

const Role = require('../../game/Role');

const assert = require('assert');
const UnitTest = require('../UnitTest');

class BoardTest extends UnitTest {

	constructor() {
		super('Test game board');
	}

	async run() {
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.Troublemaker.value);
			roles.push(Role.Robber.value);
			roles.push(Role.Villager.value);
		}

		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		// Check invalid room id
		await this.get('board', {id: 1234});
		await this.assertError(404, 'The room does not exist');

		// Fetch game board
		await this.get('board', {id: room.id});
		const board = await this.getJSON();

		// Make sure seats are correct and in ascending order
		assert(board.players.length === playerNum);
		for (let seat = 1; seat <= playerNum; seat++) {
			const player = board.players[seat - 1];
			assert(player.seat === seat);
			assert(!player.ready);
		}

		// Check the skills of troublemaker and robber
		const checkReady = async (seat, ready) => {
			await this.get('board', {id: room.id});
			const newBoard = await this.getJSON();
			for (let i = 1; i <= playerNum; i++) {
				const player = board.players[i - 1];

				const np = newBoard.players[i - 1];
				assert(np.seat === i);

				if (i === seat) {
					assert(np.ready === ready);
				} else {
					assert(player.ready === np.ready);
				}
			}
		}
		for (let seat = 1; seat <= playerNum; seat++) {
			const auth = {id: room.id, seat, seatKey: 1};
			await this.get('role', auth);
			const my = await this.getJSON();

			if (my.role === Role.Troublemaker.value) {
				await checkReady(seat, false);
				const exchange = [
					my.seat > 1 ? my.seat - 1 : playerNum,
					my.seat < playerNum ? my.seat + 1 : 1,
				];
				await this.post('skill', auth, {players: exchange});
				await this.assertOk();
				await checkReady(seat, true);

			} else if (my.role === Role.Robber.value) {
				await checkReady(seat, false);
				const robbed = my.seat < playerNum ? my.seat + 1 : 1;
				await this.post('skill', auth, {player: robbed});
				const vision = await this.getJSON();
				assert(vision.players);
				assert(vision.players.length === 1);
				await checkReady(seat, true);

			} else if (my.role === Role.Villager.value) {
				await checkReady(seat, true);

			} else {
				assert.fail('Unexpected role exists');
			}

			board.players[seat - 1].ready = true;
		}

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = BoardTest;

