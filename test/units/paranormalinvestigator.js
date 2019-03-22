
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');
const Team = require('../../game/Team');
const shuffle = require('../../util/shuffle');

function createFilter(team) {
	return function (player) {
		return Role.fromNum(player.role).team === team;
	};
}

const filterVillager = createFilter(Team.Villager);

function chooseOne(players, team) {
	const targets = players.filter(createFilter(team));
	const i = Math.floor(Math.random() * targets.length);
	return targets[i].seat;
}

const TestCases = [
	{ // Choose two villagers
		choose(players) {
			const villagers = players.filter(filterVillager).map(player => player.seat);
			shuffle(villagers);
			return villagers.slice(0, 2);
		},
		validate(targets) {
			return targets.length == 2;
		},
		confirm(me) {
			return me.role === Role.ParanormalInvestigator.value;
		},
	},
	{ // Choose one villager and one werewolf
		choose(players) {
			const t1 = chooseOne(players, Team.Villager);
			const t2 = chooseOne(players, Team.Werewolf);
			return [t1, t2];
		},
		validate(targets) {
			return targets.length == 2;
		},
		confirm(me) {
			return me.role === Role.Werewolf.value;
		},
	},
	{ // Choose one villager and one tanner
		choose(players) {
			const t1 = chooseOne(players, Team.Villager);
			const t2 = chooseOne(players, Team.Tanner);
			return [t1, t2];
		},
		validate(targets) {
			return targets.length == 2;
		},
		confirm(me) {
			return me.role === Role.Tanner.value;
		},
	},
	{ // Choose one werewolf and one villager
		choose(players) {
			const t1 = chooseOne(players, Team.Werewolf);
			const t2 = chooseOne(players, Team.Villager);
			return [t1, t2];
		},
		validate(targets) {
			return targets.length == 1;
		},
		confirm(me) {
			return me.role === Role.Werewolf.value;
		},
	},
	{ // Choose one tanner and one villager
		choose(players) {
			const t1 = chooseOne(players, Team.Tanner);
			const t2 = chooseOne(players, Team.Villager);
			return [t1, t2];
		},
		validate(targets) {
			return targets.length == 1;
		},
		confirm(me) {
			return me.role === Role.Tanner.value;
		},
	},
	{ // Choose one werewolf and one tanner
		choose(players) {
			const t1 = chooseOne(players, Team.Werewolf);
			const t2 = chooseOne(players, Team.Tanner);
			return [t1, t2];
		},
		validate(targets) {
			return targets.length == 1;
		},
		confirm(me) {
			return me.role === Role.Werewolf.value;
		},
	},
	{ // Choose one tanner and one werewolf
		choose(players) {
			const t1 = chooseOne(players, Team.Tanner);
			const t2 = chooseOne(players, Team.Werewolf);
			return [t1, t2];
		},
		validate(targets) {
			return targets.length == 1;
		},
		confirm(me) {
			return me.role === Role.Tanner.value;
		},
	},
];

class ParanormalInvestigatorTest extends UnitTest {

	constructor() {
		super('Test paranormal investigator');
	}

	async run() {
		this.tcId = 0;
		for (const tc of TestCases) {
			this.tcId++;
			this.tc = tc;
			await this.runOnce();
		}
	}

	chooseTargets(players) {
		return this.tc.choose.call(this, players);
	}

	validateVision(players, targets) {
		if (!this.tc.validate.call(this, targets)) {
			return false;
		}

		for (const target of targets) {
			const baseline = players[target.seat - 1];
			if (target.role !== baseline.role) {
				return false;
			}
		}

		return true;
	}

	validateBoard(me) {
		return this.tc.confirm.call(this, me);
	}

	async runOnce() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.ParanormalInvestigator.value);
			roles.push(Role.Werewolf.value);
			roles.push(Role.Tanner.value);
		}
		for (let i = 0; i < 70; i++) {
			roles.push(Math.floor(Math.random() * (Role.enums.length - 1)) + 1);
		}

		// Create a room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		// Get all roles
		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: 1});
			const my = await this.getJSON();
			players.push(my);
		}

		// Find paranormal investigator
		const me = players.find(player => player.role === Role.ParanormalInvestigator.value);
		assert(me && me.seat);
		const auth = {id: room.id, seat: me.seat, seatKey: 1};

		console.log('Test invalid targets');
		await this.post('skill', auth, {});
		await this.assertError(400, 'Invalid skill targets');
		await this.post('skill', auth, {players: [me.seat]});
		await this.assertError(400, 'Invalid skill targets');
		await this.post('skill', auth, {players: [me.seat, me.seat + 1]});
		await this.assertError(400, 'Invalid skill targets')
		await this.post('skill', auth, {players: [me.seat, me.seat - 1]});
		await this.assertError(400, 'Invalid skill targets');

		console.log('Test skill vision');
		const targets = this.chooseTargets(players.filter(player => player.seat != me.seat));
		const seenRoles = targets.map(seat => players[seat - 1].role).map(Role.fromNum);
		console.log(`Investigate Player ${targets[0]} (${seenRoles[0].key}) and Player ${targets[1]} (${seenRoles[1].key})`);
		await this.post('skill', auth, {players: targets});
		const vision = await this.getJSON();
		if (!this.validateVision(players, vision.players)) {
			assert.fail('TC' + this.tcId + ': Invalid vision');
		}

		// Vote and see lync result
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.post('lynch', {id: room.id, seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const board = await this.getJSON();

		console.log('Test skill side-effect');
		const cur = board.players[me.seat - 1];
		console.log('Now his role is ' + Role.fromNum(cur.role).key);
		if (!this.validateBoard(cur)) {
			assert.fail('TC' + this.tcId + ': Invalid skill effects on the investigator');
		}

		// Delete the room
		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = ParanormalInvestigatorTest;
