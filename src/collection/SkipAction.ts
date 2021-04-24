import Action from '../game/Action';
import ActionType from '../game/ActionType';
import { Skill } from '../game/Player';

export default class SkipAction extends Action {
	constructor(skill: Skill) {
		super(skill, ActionType.None);
	}

	protected run(): void {
		this.executed = true;
	}
}
