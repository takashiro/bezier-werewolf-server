import { Role } from '@bezier/werewolf-core';

import collections from '../../src/collection';
import Driver from '../../src/game/Driver';

const driver = new Driver();
const roles: Role[] = [Role.AlphaWolf];
for (let i = 0; i < 5; i++) {
	roles.push(1000 + i);
}

it('sets all roles', () => {
	driver.setRoles(roles);
	driver.loadCollection(...collections);
	const shuffleRoles = jest.spyOn(driver, 'shuffleRoles');
	shuffleRoles.mockReturnValue(roles);
	driver.prepare();
});

it('runs dangling hooks', () => {
	const players = driver.getPlayers();
	expect(players.some((player) => player.getRolle() === Role.AlphaWolf)).toBe(false);
	const centerCards = driver.getCenterCards();
	expect(centerCards).toHaveLength(4);
});
