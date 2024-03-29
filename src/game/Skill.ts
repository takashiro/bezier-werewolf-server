import { EventEmitter } from 'events';

import EventHook from './EventHook.js';
import MutexType from './MutexType.js';

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

	protected readMode: MutexType[] = [];

	protected writeMode: MutexType[] = [];

	protected ready = false;

	protected order = 0;

	protected output: OutputType | null = null;

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
	 * @return All the mutex types that the skill reads.
	 */
	getReadMode(): MutexType[] {
		return this.readMode.slice();
	}

	/**
	 * @return Whether the skill reads something.
	 */
	isReader(): boolean {
		return this.readMode.length > 0;
	}

	/**
	 * @return All the mutex types that the skill reads.
	 */
	getWriteMode(): MutexType[] {
		return this.writeMode.slice();
	}

	/**
	 * Whether the skill produces any action that should be ordered.
	 */
	isSequential(): boolean {
		return this.writeMode.length > 0;
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
		return this.output !== null;
	}

	/**
	 * Check if the selected targets are feasible to invoke the skill
	 * @param driver
	 * @param self
	 * @param data
	 */
	abstract isFeasible(data: InputType): boolean;

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
