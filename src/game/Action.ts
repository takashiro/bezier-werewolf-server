import Player, { Skill } from './Player';

export default abstract class Action {
	protected skill: Skill;

	protected executed = false;

	/**
	 * An action to be executed
	 * @param skill
	 * @param priority
	 */
	constructor(skill: Skill) {
		this.skill = skill;
	}

	/**
	 * @return The skill that performs the action.
	 */
	getSkill(): Skill {
		return this.skill;
	}

	/**
	 * @return The execution order.
	 */
	getOrder(): number {
		return this.skill.getOrder();
	}

	/**
	 * @return Action owner
	 */
	getOwner(): Player {
		return this.skill.getOwner();
	}

	/**
	 * @return Whether the action has been executed.
	 */
	isExecuted(): boolean {
		return this.executed;
	}

	/**
	 * Execute the action.
	 * @return If the action is already executed, skip execution and return false.
	 */
	exec(): boolean {
		if (this.executed) {
			return false;
		}

		this.run();
		this.executed = true;
		return true;
	}

	/**
	 * A function to implement action effect.
	 */
	protected abstract run(): void;
}
