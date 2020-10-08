import EventListener from './EventListener';

export default abstract class Skill<OwnerType, DriverType, InputType, OutputType> {
	protected owner?: OwnerType;

	protected driver?: DriverType;

	protected output?: OutputType;

	protected listeners?: EventListener<unknown>[];

	setOwner(owner: OwnerType): void {
		this.owner = owner;
	}

	getOwner(): OwnerType | undefined {
		return this.owner;
	}

	setDriver(driver: DriverType): void {
		this.driver = driver;
	}

	getDriver(): DriverType | undefined {
		return this.driver;
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
