import { Room as RoomMeta } from '@bezier/werewolf-core';

import randstr from '../util/randstr.js';
import Driver from './Driver.js';

class Room {
	protected id: number;

	protected salt: string;

	protected driver?: Driver;

	protected ownerKey: string;

	constructor() {
		this.id = 0;
		this.salt = randstr(8);
		this.ownerKey = randstr(32);
	}

	getId(): number {
		return this.id;
	}

	getSalt(): string {
		return this.salt;
	}

	getOwnerKey(): string {
		return this.ownerKey;
	}

	/**
	 * Set up a game driver
	 * @param driver
	 */
	setDriver(driver: Driver): void {
		this.driver = driver;
	}

	/**
	 * Get the game engine
	 */
	getDriver(): Driver | undefined {
		return this.driver;
	}

	toJSON(): RoomMeta {
		const config = this.driver?.getConfig();
		return {
			id: this.id,
			salt: this.salt,
			cardNum: config ? config.cardNum : 0,
			roles: config ? config.roles : [],
			random: config ? config.random : true,
			loneWolf: config ? config.loneWolf : false,
		};
	}
}

export default Room;
