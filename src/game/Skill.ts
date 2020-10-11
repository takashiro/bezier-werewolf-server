import EventListener from './EventListener';

export default abstract class Skill<OwnerType, DriverType, InputType, OutputType> {
	protected readonly driver: DriverType;

	protected owner: OwnerType;

	protected priority = 0;

	protected output?: OutputType;

	protected listeners?: EventListener<unknown>[];

	constructor(driver: DriverType, owner: OwnerType) {
		this.driver = driver;
		this.owner = owner;
	}

	/**
	 *@return Game driver that the skill is registered to.
	 */
	getDriver(): DriverType {
		return this.driver;
	}

	/**
	 * @return Skill owner.
	 */
	getOwner(): OwnerType {
		return this.owner;
	}

	/**
	 * @return Skill priority in ascending order.
	 */
	getPriority(): number {
		return this.priority;
	}

	getListeners(): EventListener<unknown>[] | undefined {
		return this.listeners;
	}

	/**
	 * Check if the skill has been invoked
	 */
	isFinished(): boolean {
		return Object.prototype.hasOwnProperty.call(this, 'output');
	}

	/**
	 * Check if the selected targets are feasible to invoke the skill
	 * @param driver
	 * @param self
	 * @param data
	 */
	isFeasible(data: InputType): boolean {
		return Boolean(this.driver && data);
	}

	/**
	 * Invoke the skill.
	 * run() will be called and its output will be recorded.
	 * @param data
	 */
	exec(data: InputType): OutputType {
		if (this.isFinished()) {
			return this.output as OutputType;
		}
		this.output = this.run(data);
		return this.output;
	}

	/**
	 * Take effect on targets
	 * @param data
	 * @return data transfered to clients
	 */
	protected abstract run(data: InputType): OutputType;
}
