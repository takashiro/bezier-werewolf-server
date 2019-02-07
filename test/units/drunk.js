
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');

class DrunkTest extends UnitTest {

	constructor() {
		super('Test drunk');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.Drunk.value);
			roles.push(Role.Seer.value);
		}
		for (let i = 0; i < 40; i++) {
			const role = Math.floor(Math.random() * (Role.enums.length - 1)) + 1;
			if (role !== Role.Drunk.value) {
				roles.push(role);
			}
		}

		// Create a room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: 1});
			const player = await this.getJSON();
			players.push(player);
		}

		const drunk = players.find(player => player.role === Role.Drunk.value);
		const auth = {id: room.id, seat: drunk.seat, seatKey: 1};

		// Validate user input
		await this.post('skill', auth, {});
		await this.assertError(400, 'Invalid skill targets');

		// Non-existing target
		await this.post('skill', auth, {card: 3});
		await this.assertError(400, 'Invalid skill targets');
		await this.post('skill', auth, {card: -1});
		await this.assertError(400, 'Invalid skill targets');

		// Exchange the card with a center card
		let card = Math.floor(Math.random() * 3);
		console.log('Exchange with Card ' + card);
		await this.post('skill', auth, {card});
		await this.assertOk();

		// Check center cards
		const seer = players.find(player => player.role === Role.Seer.value);
		await this.post('skill', {id: room.id, seat: seer.seat, seatKey: 1}, {cards: [card, (card + 1) % 3]});
		const vision = await this.getJSON();

		// Reveal all roles
		for (const player of players) {
			await this.post('lynch', {id: room.id, seat: player.seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const board = await this.getJSON();

		assert(board.centerCards[card] === Role.Drunk.value);
		assert(board.players[drunk.seat - 1].role === vision.cards[0].role);

		// Clean up
		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = DrunkTest;
