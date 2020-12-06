import { Role } from '@bezier/werewolf-core';

import Player from '../../src/game/Player';
import Driver from '../../src/game/Driver';

import AlphaWolf from '../../src/collection/daybreak/AlphaWolf';
import Witch from '../../src/collection/daybreak/Witch';
import Robber from '../../src/collection/standard/Robber';

const driver = new Driver();
const owner = new Player(0, Role.Unknown);
const wolf = new AlphaWolf(driver, owner);
const robber = new Robber(driver, owner);
const witch = new Witch(driver, owner);
const skills = [wolf, robber, witch];

it('registers skills', () => {
	for (const skill of skills) {
		expect(skill.isReady()).toBe(false);
	}
	driver.registerSkills(skills);
});

it('wakes up Alpha Wolf', () => {
	expect(wolf.isReady()).toBe(true);
	expect(witch.isReady()).toBe(false);
	expect(robber.isReady()).toBe(false);
});

it('wakes up Robber', () => {
	wolf.emit('finished');
	expect(robber.isReady()).toBe(true);
	expect(witch.isReady()).toBe(false);
	expect(driver.getPhase()).toBe(1);
});

it('wakes up Witch', () => {
	robber.emit('finished');
	expect(witch.isReady()).toBe(true);
	expect(driver.getPhase()).toBe(2);
});
