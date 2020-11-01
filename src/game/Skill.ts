import { EventEmitter } from 'events';

import EventHook from './EventHook';
import SkillMode from './SkillMode';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Skill<DriverType, OwnerType, InputType, OutputType> {
	on(event: 'finished', listener: () => void): this;
	once(event: 'finished', listener: () => void): this;
	off(event: 'finished', listener: () => void): this;
}

abstract class Skill<DriverType, OwnerType, InputType, OutputType> extends EventEmitter {
	protected readonly driver: DriverType;

	protected owner: OwnerType;

	protected priority = 0;

	protected mode = SkillMode.Invalid;

	protected ready = false;

	protected order = 0;

	protected output?: OutputType;

	protected hooks?: EventHook<unknown>[];

	constructor(driver: DriverType, owner: OwnerType) {
		super();
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

	/**
	 * @param mode Skill mode
	 * @return Wether the skill mode is enabled.
	 */
	hasMode(mode: SkillMode): boolean {
		return (this.mode & mode) === mode;
	}

	/**
	 * @return Skill listeners bound to events.
	 */
	getHooks(): EventHook<unknown>[] | undefined {
		return this.hooks;
	}

	/**
	 * @return Whether the skill is marked as ready.
	 */
	isReady(): boolean {
		return this.ready;
	}

	/**
	 * Sets ready state.
	 * @param ready
	 */
	setReady(ready: boolean): void {
		this.ready = ready;
	}

	/**
	 * @return The execution order in the game.
	 */
	getOrder(): number {
		return this.order;
	}

	/**
	 * Sets the execution order by the driver.
	 * @param order
	 */
	setOrder(order: number): void {
		this.order = order;
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
		if (this.isFinished()) {
			this.emit('finished');
		}
		return this.output;
	}

	/**
	 * Take effect on targets
	 * @param data
	 * @return data transfered to clients
	 */
	protected abstract run(data: InputType): OutputType;
}

export default Skill;
