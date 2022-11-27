import {
	expect,
	it,
	jest,
} from '@jest/globals';

import { Role } from '@bezier/werewolf-core';

import Driver from '../../src/game/Driver';
import Skill from '../../src/collection/Skill';
import Player from '../../src/game/Player';

class DummySkill extends Skill<unknown> {
	isFeasible(): boolean {
		return Boolean(this.driver);
	}

	protected run(): unknown {
		return this.driver;
	}
}

const driver = new Driver();
const getCenterCard = jest.spyOn(driver, 'getCenterCard');
const getPlayer = jest.spyOn(driver, 'getPlayer');

const owner = new Player(1, Role.Unknown);
const skill = new DummySkill(driver, owner);

it('returns undefined if card selection is undefined', () => {
	expect(skill.selectCard(undefined)).toBeUndefined();
	expect(skill.selectCards(undefined, 2)).toBeUndefined();
});

it('returns undefined if one center card is not found', () => {
	getCenterCard.mockReturnValueOnce(undefined);
	const cards = skill.selectCards({ cards: [0] }, 1);
	expect(cards).toBeUndefined();
	expect(getCenterCard).toBeCalledTimes(1);
});

it('returns undefined if the number of center cards is incorrect', () => {
	const cards = skill.selectCards({ cards: [0, 2] }, 3);
	expect(cards).toBeUndefined();
});

it('returns undefined if player selection is undefined', () => {
	expect(skill.selectPlayer(undefined)).toBeUndefined();
	expect(skill.selectPlayers(undefined, 1)).toBeUndefined();
});

it('returns undefined if one player is not found', () => {
	const players = skill.selectPlayers({ players: [1, 2] }, 2);
	expect(players).toBeUndefined();
});

it('returns undefined if the number of players is incorrect', () => {
	getPlayer.mockReturnValueOnce(undefined);
	const players = skill.selectPlayers({ players: [1, 2] }, 3);
	expect(players).toBeUndefined();
	expect(getPlayer).toBeCalledTimes(1);
});
