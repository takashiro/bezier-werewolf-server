import Player, { Skill } from './Player';

export default abstract class Action {
	protected skill: Skill;

	protected readOnly = false;

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
	 * @return Whether the action is read-only.
	 */
	isReadOnly(): boolean {
		return this.readOnly;
	}

	/**
	 * Execute the action.
	 */
	exec(): void {
		if (this.executed) {
			return;
		}

		this.run();
		this.executed = true;
	}

	/**
	 * A function to implement action effect.
	 */
	protected abstract run(): void;
}
