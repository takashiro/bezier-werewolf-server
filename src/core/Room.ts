import randstr from '../util/randstr';
import Driver from './Driver';

export default class Room {
	protected id: number;

	protected salt: string;

	protected driver?: Driver;

	protected ownerKey: string;

	protected timer?: NodeJS.Timeout;

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

	setTimer(timer: NodeJS.Timeout): void {
		this.timer = timer;
	}

	getTimer(): NodeJS.Timeout | undefined {
		return this.timer;
	}

	destroy(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}
	}
}
