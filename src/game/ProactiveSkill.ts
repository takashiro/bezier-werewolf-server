import Skill from './Skill';

export default abstract class ProactiveSkill<OwnerType, DriverType, InputType, OutputType> extends Skill<OwnerType, DriverType> {
	protected state: number;

	protected stateNum: number;

	protected output?: OutputType;

	constructor() {
		super();

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
	isFeasible(data: InputType): boolean {
		return Boolean(this.driver && data);
	}

	/**
	 * Check if the skill has been invoked
	 * @param data
	 */
	abstract isInvoked(data: InputType): boolean;

	/**
	 * Invoke the skill.
	 * takeEffect() will be called, skill state will be updated and its output will be recorded.
	 * @param data
	 */
	invoke(data: InputType): void {
		this.output = this.takeEffect(data);
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
	 * @param data
	 * @return data transfered to clients
	 */
	abstract takeEffect(data: InputType): OutputType;
}
