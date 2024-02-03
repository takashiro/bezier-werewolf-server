import Action from '../game/Action.js';
import ActionType from '../game/ActionType.js';
import { Skill } from '../game/Player.js';

export default class SkipAction extends Action {
	constructor(skill: Skill) {
		super(skill, ActionType.None);
	}

	protected run(): void {
		this.executed = true;
	}
}
