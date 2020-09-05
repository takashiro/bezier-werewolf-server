import Player from './Player';

export default abstract class Action<DriverType> {
	protected owner: Player;

	protected priority: number;

	/**
	 * An action to be executed
	 * @param owner
	 * @param priority
	 */
	constructor(owner: Player, priority: number) {
		this.owner = owner;
		this.priority = priority;
	}

	/**
	 * @return owner
	 */
	getOwner(): Player {
		return this.owner;
	}

	/**
	 * @return priority
	 */
	getPriority(): number {
		return this.priority;
	}

	/**
	 * Action effect
	 * @param driver
	 */
	abstract execute(driver: DriverType): void;
}
