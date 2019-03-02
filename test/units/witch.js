
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class WitchTest extends UnitTest {

	constructor() {
		super('Test witch');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.Witch.value);
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

		// Invoke witches' skills
		const exchanged = {
			card: null,
			role: null,
			player: null,
		};
		for (let seat = 1; seat <= playerNum; seat++) {
			const player = players[seat - 1];
			if (player.role !== Role.Witch.value) {
				continue;
			}

			const auth = {id: room.id, seat, seatKey: 1};

			console.log('Test invalid card targets');
			await this.post('skill', auth, {card: 3});
			await this.assertError(400, 'Invalid skill targets');
			await this.post('skill', auth, {player: 1});
			await this.assertError(400, 'Invalid skill targets');

			exchanged.card = Math.floor(Math.random() * 3);
			console.log(`View center card ${exchanged.card}`);
			await this.post('skill', auth, {card: exchanged.card});
			let vision = await this.getJSON();
			assert(vision.cards && vision.cards.length === 1);
			assert(vision.cards[0].pos === exchanged.card);

			exchanged.role = vision.cards[0].role;
			console.log('The card is ' + Role.fromNum(exchanged.role).key);

			exchanged.player = Math.floor(Math.random() * playerNum) + 1;
			console.log('Exchange it with player ' + exchanged.player);
			await this.post('skill', auth, {player: exchanged.player});
			vision = await this.getJSON();
			assert(vision.players && vision.players.length === 1);
			const target = vision.players[0];
			assert(target.seat === exchanged.player);
			assert(target.role === exchanged.role);

			break;
		}

		// Vote and see lync result
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.post('lynch', {id: room.id, seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const board = await this.getJSON();

		assert(board.players.length > 0);
		for (const player of board.players) {
			const baseline = players[player.seat - 1];
			if (player.seat === exchanged.player) {
				assert(player.role === exchanged.role);
			} else {
				assert(player.role === baseline.role);
			}
		}

		assert(board.cards.length > 0);
		assert(board.cards[exchanged.card].role === players[exchanged.player - 1].role);

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = WitchTest;
