import {
	expect,
	it,
} from '@jest/globals';

import Room from '../../src/base/Room.js';

const room = new Room();

it('generates random keys', () => {
	expect(room.getSalt()).toHaveLength(8);
	expect(room.getOwnerKey()).toHaveLength(32);
});

it('generates JSON representation', () => {
	expect(room.toJSON()).toStrictEqual({
		id: 0,
		salt: room.getSalt(),
		cardNum: 0,
		roles: [],
		random: true,
		loneWolf: false,
	});
});
