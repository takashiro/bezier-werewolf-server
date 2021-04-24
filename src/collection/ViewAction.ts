import Action from '../game/Action';
import ActionType from '../game/ActionType';
import Card from '../game/Card';
import Player, { Skill } from '../game/Player';

export default class ViewAction extends Action {
	protected targets: (Player | Card)[];

	constructor(skill: Skill, targets: (Player | Card)[]) {
		super(skill, ActionType.ViewRole);
		this.targets = targets;
		this.executed = true;
	}

	protected run(): void {
		this.executed = true;
	}
}
