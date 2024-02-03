import ActionType from './ActionType.js';
import Player, { Skill } from './Player.js';

export default abstract class Action {
	protected skill: Skill;

	protected type: ActionType;

	protected executed = false;

	/**
	 * An action to be executed
	 * @param skill
	 * @param priority
	 */
	constructor(skill: Skill, type: ActionType) {
		this.skill = skill;
		this.type = type;
	}

	/**
	 * @return The skill that performs the action.
	 */
	getSkill(): Skill {
		return this.skill;
	}

	/**
	 *
	 * @return How the action is categorized.
	 */
	getType(): ActionType {
		return this.type;
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
