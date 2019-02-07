
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

async function test1() {
	console.log('Forecast center cards');
	let roles = [
		Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.Werewolf,
		Role.Villager, Role.Villager, Role.Villager, Role.Villager,
		Role.Seer, Role.Seer, Role.Seer, Role.Seer, Role.Seer, Role.Seer,
	];
	await this.post('room', {roles: roles.map(role => role.toNum())});
	let room = await this.getJSON();
	let seerNum = 0;

	let centerCards = new Array(3);
	let a = 0;
	let b = 1;
	for (let seat = 1; seat <= roles.length - 3; seat++) {
		await this.get('role', {id: room.id, seat, seatKey: seat});
		const player = await this.getJSON();
		if (player.role !== Role.Seer.value) {
			continue;
		}
		seerNum++;

		let cards = [a, b];
		await this.post('skill', {id: room.id, seat, seatKey: seat}, {cards});
		let vision = await this.getJSON();
		assert(vision.cards instanceof Array && vision.cards.length == 2);
		if (centerCards[a]) {
			assert(vision.cards[0].role === centerCards[a]);
		} else {
			centerCards[a] = vision.cards[0].role;
		}
		if (centerCards[b]) {
			assert(vision.cards[1].role === centerCards[b]);
		} else {
			centerCards[b] = vision.cards[1].role;
		}

		a = (a + 1) % 3;
		b = (b + 1) % 3;
	}

	assert(seerNum >= 3);

	await this.delete('room', room);
	await this.assertJSON({id: room.id});
}

async function test2() {
	console.log('Forecast players');
	let roles = [];
	for (let i = 0; i < 15; i++) {
		roles.push(Role.Seer.value);
	}
	for (let i = 0; i < 35; i++) {
		roles.push(1 + Math.floor(Math.random() * (Role.enums.length - 1)));
	}

	await this.post('room', {roles});
	let room = await this.getJSON();

	let playerNum = roles.length - 3;
	let players = [];
	for (let seat = 1; seat <= playerNum; seat++) {
		await this.get('role', {id: room.id, seat, seatKey: 1});
		let my = await this.getJSON();
		players.push(my);
	}

	for (let player of players) {
		if (player.role !== Role.Seer.value) {
			continue;
		}

		let target = Math.floor(Math.random() * playerNum) + 1;
		await this.post('skill', {id: room.id, seat: player.seat, seatKey: 1}, {player: target});
		let vision = await this.getJSON();
		assert(vision.players.length === 1);
		assert(vision.players[0].role === players[target - 1].role);
	}

	await this.delete('room', room);
	await this.assertJSON({id: room.id});
}

class SeerTest extends UnitTest {

	constructor() {
		super('Test seer');
	}

	async run() {
		await test1.call(this);
		await test2.call(this);
	}

}

module.exports = SeerTest;
