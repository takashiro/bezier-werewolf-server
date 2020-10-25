import Player, { Skill } from './Player';

export default abstract class Action {
	protected skill: Skill;

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
	 * @return Action owner
	 */
	getOwner(): Player {
		return this.skill.getOwner();
	}

	/**
	 * @return Skill Priority
	 */
	getPriority(): number {
		return this.skill.getPriority();
	}

	/**
	 * Action effect
	 */
	abstract exec(): void;
}
