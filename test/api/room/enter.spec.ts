import { Room } from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

const roles = [1, 1, 2, 2, 1, 2, 2, 2];
const room = {
	id: 0,
	salt: '',
	ownerKey: '',
};
it('creates a room', async () => {
	const res = await self.post('/room').send({ roles });
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

let r: Room;
it('enters the room', async () => {
	const res = await self.get(`/room/${room.id}`);
	r = res.body;
});

it('validates role config', async () => {
	expect(r.id).toBe(room.id);
	expect(r.salt).toBe(room.salt);
	expect(r.ownerKey).toBeUndefined();
	expect(r.roles).toHaveLength(roles.length);

	const roles1 = [...r.roles];
	roles1.sort();
	const roles2 = [...roles];
	roles2.sort();
	expect(roles1).toStrictEqual(roles2);
});

it('exits the room', async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
});
