import Lobby from '../../src/base/Lobby';
import Room from '../../src/base/Room';

const lobby = new Lobby();

it('has a capacity of 1000 by default', () => {
	expect(lobby.getCapacity()).toBe(1000);
});

it('generates random room number', () => {
	const room = new Room();
	lobby.add(room);
	expect(room.getId()).toBeGreaterThan(0);
	lobby.remove(room.getId());
});

it('generates massive rooms', () => {
	const ids = new Set<number>();
	for (let i = 0; i < 1000; i++) {
		const room = new Room();
		lobby.add(room);
		ids.add(room.getId());
	}

	const fin = new Room();
	expect(lobby.add(fin)).toBe(false);
	expect(fin.getId()).toBe(0);

	for (const id of ids) {
		lobby.remove(id);
	}

	expect(ids.size).toBe(1000);
});
