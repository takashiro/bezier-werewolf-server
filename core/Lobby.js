
let nextRoomId = 0;

/**
 * Room Manager
 */
class Lobby {

	constructor(roomExpiry = 60 * 60 * 1000, roomNumLimit = 1000) {
		this.roomNumLimit = roomNumLimit;
		this.rooms = new Map;
		this.roomExpiry = roomExpiry;
	}

	/**
	 * Current status of Lobby
	 * @return {{roomNum: number, roomNumLimit: number}}
	 */
	getStatus() {
		return {
			roomNum: this.rooms.size,
			roomNumLimit: this.roomNumLimit,
		};
	}

	/**
	 * Check if there's still any vacancy to create a new room
	 * @return {boolean}
	 */
	isAvailable() {
		return this.rooms.size < this.roomNumLimit;
	}

	/**
	 * Get the room
	 * @param {number} id
	 * @return {Room}
	 */
	get(id) {
		return this.rooms.get(id);
	}

	/**
	 * Add a new room and assign room id
	 * @param {Room} room
	 * @return {boolean} Whether the room is successfully added
	 */
	add(room) {
		if (this.rooms.size >= this.roomNumLimit) {
			return false;
		}

		do {
			nextRoomId++;
			if (nextRoomId > this.roomNumLimit) {
				nextRoomId = 1;
			}
		} while (this.rooms.has(nextRoomId));

		room.id = nextRoomId;
		this.rooms.set(room.id, room);

		let roomId = room.id;
		setTimeout(() => {
			this.remove(roomId);
		}, this.roomExpiry);

		return true;
	}

	/**
	 * Delete an existing room by room id
	 * @param {number} id Room ID
	 * @return {boolean} Whether the room exists and is successfully deleted
	 */
	remove(id) {
		if (this.rooms.has(id)) {
			this.rooms.delete(id);
			return true;
		} else {
			return false;
		}
	}

}

module.exports = Lobby;
