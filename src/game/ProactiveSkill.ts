import { Role } from '@bezier/werewolf-core';
import Skill from './Skill';
import Player from './Player';

export default abstract class ProactiveSkill<DriverType, InputType, OutputType> extends Skill {
	protected state: number;

	protected stateNum: number;

	protected output?: OutputType;

	constructor(role: Role) {
		super(role);

		this.state = 0;
		this.stateNum = 1;
	}

	/**
	 * Check if the skill has been invoked
	 */
	isUsed(): boolean {
		return this.state >= this.stateNum;
	}

	/**
	 * Check if the selected targets are feasible to invoke the skill
	 * @param driver
	 * @param self
	 * @param data
	 */
	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	isFeasible(driver: DriverType, self: Player, data: InputType): boolean {
		return !!driver && !!self;
	}

	/**
	 * Check if the skill has been invoked
	 * @param driver
	 * @param self
	 * @param data
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isInvoked(driver: DriverType, self: Player, data: InputType): boolean {
		return this.isUsed();
	}

	/**
	 * Invoke the skill.
	 * takeEffect() will be called, skill state will be updated and its output will be recorded.
	 * @param driver
	 * @param self
	 * @param data
	 */
	invoke(driver: DriverType, self: Player, data: InputType): void {
		this.output = this.takeEffect(driver, self, data);
		this.state++;
	}

	/**
	 * @return the output of the last invocation.
	 */
	getOutput(): unknown {
		return this.output;
	}

	/**
	 * Take effect on targets
	 * @param driver
	 * @param self
	 * @param data
	 * @return data transfered to clients
	 */
	abstract takeEffect(driver: DriverType, self: Player, data: InputType): OutputType;
}
