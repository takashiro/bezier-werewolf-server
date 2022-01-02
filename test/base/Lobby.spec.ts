import Lobby from '../../src/base/Lobby';
import Room from '../../src/base/Room';

const lobby = new Lobby();

it('has a capacity of 1000 by default', () => {
	expect(lobby.getCapacity()).toBe(1000);
});

it('changes capacity', () => {
	lobby.setCapacity(100);
	expect(lobby.getCapacity()).toBe(100);
});

it('changes expiry', () => {
	lobby.setRoomExpiry(10);
	expect(lobby.getRoomExpiry()).toBe(10);
});

it('generates random room number', () => {
	const room = new Room();
	lobby.add(room);
	expect(room.getId()).toBeGreaterThan(0);
	expect(lobby.remove(room.getId())).toBe(true);
	expect(lobby.remove(room.getId())).toBe(false);
});

it('generates massive rooms', () => {
	const ids = new Set<number>();
	for (let i = 0; i < 100; i++) {
		const room = new Room();
		lobby.add(room);
		ids.add(room.getId());
	}

	const fin = new Room();
	expect(lobby.add(fin)).toBe(false);
	expect(fin.getId()).toBe(0);
	expect(ids.size).toBe(100);
});

it('automatically removes expired rooms', async () => {
	await new Promise<void>((resolve) => {
		setTimeout(resolve, 20);
	});
	const status = lobby.getStatus();
	expect(status.roomNum).toBe(0);
});
