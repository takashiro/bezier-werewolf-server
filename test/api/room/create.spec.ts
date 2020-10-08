import {
	Role,
	Room,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

it('requires roles', async () => {
	await self.post('/room')
		.expect(400, 'Invalid roles parameter');
});

it('ignores extra parameters', async () => {
	await self.post('/room').send({ test: 1 })
		.expect(400, 'Invalid roles parameter');
});

it('requires at least 3 roles', async () => {
	await self.post('/room').send({ roles: [1234, 5678] })
		.expect(400, 'At least 3 roles must be selected');
});

const room: Room = {
	id: 0,
	salt: '',
	ownerKey: '',
	roles: [] as Role[],
};
it('creates a room', async () => {
	const roles = [Role.Werewolf, Role.Werewolf, Role.Villager, Role.Villager, Role.Villager];
	const res = await self.post('/room').send({ roles });
	expect(res.status).toBe(200);

	Object.assign(room, res.body);
	expect(room.id).toBeGreaterThan(0);
	expect(room.salt).toHaveLength(8);
	expect(room.ownerKey).toHaveLength(32);
	expect([...room.roles].sort()).toStrictEqual([...roles].sort());
});

it('cannot delete a room without its owner key', async () => {
	await self.delete(`/room/${room.id}`)
		.expect(404, 'The room does not exist');
});

it('deletes the room', async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});
