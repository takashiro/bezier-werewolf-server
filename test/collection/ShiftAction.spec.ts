import { Role } from '@bezier/werewolf-core';

import Player, { Skill } from '../../src/game/Player';
import ShiftAction, { ShiftDirection } from '../../src/collection/ShiftAction';

const skill = {} as unknown as Skill;

it('does nothing if there is less than 1 player', () => {
	const action = new ShiftAction(skill, ShiftDirection.None, []);
	action.exec();
});

it('does nothing if direction is not defined', () => {
	const players: Player[] = [
		new Player(1, Role.Hunter),
		new Player(2, Role.Prince),
	];
	const getSeat = jest.spyOn(players[0], 'getSeat');
	const action = new ShiftAction(skill, ShiftDirection.None, players);
	action.exec();
	expect(getSeat).toBeCalled();

	expect(players[0].getRole()).toBe(Role.Hunter);
	expect(players[1].getRole()).toBe(Role.Prince);
});
