import { LobbyStatus } from '@bezier/werewolf-core';

import Room from './Room';

/**
 * Room Manager
 */
export default class Lobby {
	protected capacity: number;

	protected rooms = new Map<number, Room>();

	protected roomExpiry: number;

	constructor(capacity = 1000, roomExpiry = 60 * 60 * 1000) {
		this.capacity = capacity;
		this.roomExpiry = roomExpiry;
	}

	getCapacity(): number {
		return this.capacity;
	}

	setCapacity(capacity: number): void {
		this.capacity = capacity;
	}

	getRoomNum(): number {
		return this.rooms.size;
	}

	getRoomExpiry(): number {
		return this.roomExpiry;
	}

	setRoomExpiry(expiry: number): void {
		this.roomExpiry = expiry;
	}

	/**
	 * @return Current status of Lobby
	 */
	getStatus(): LobbyStatus {
		return {
			roomNum: this.getRoomNum(),
			capacity: this.getCapacity(),
		};
	}

	/**
	 * @return Whether there's still any vacancy to create a new room
	 */
	isAvailable(): boolean {
		return this.getRoomNum() < this.getCapacity();
	}

	/**
	 * Get the room
	 * @param id
	 */
	get(id: number): Room | undefined {
		return this.rooms.get(id);
	}

	/**
	 * Add a new room and assign room id
	 * @param {Room} room
	 * @return {boolean} Whether the room is successfully added
	 */
	add(room: Room): boolean {
		if (!this.isAvailable()) {
			return false;
		}

		const roomId = this.createRoomId();
		Reflect.set(room, 'id', roomId);
		this.rooms.set(roomId, room);

		const timer = setTimeout(() => {
			this.remove(roomId);
		}, this.roomExpiry);
		room.setTimer(timer);

		return true;
	}

	/**
	 * Delete an existing room by room id
	 * @param id Room ID
	 * @return Whether the room exists and is successfully deleted
	 */
	remove(id: number): boolean {
		const room = this.rooms.get(id);
		if (!room) {
			return false;
		}

		room.destroy();
		this.rooms.delete(id);
		return true;
	}

	/**
	 * @return A random room id
	 */
	protected createRoomId(): number {
		let id = 0;
		do {
			id = Math.floor(Math.random() * this.getCapacity() * 10);
		} while (this.rooms.has(id));
		return id;
	}
}

export const lobby = new Lobby();
