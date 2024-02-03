import Action from '../game/Action.js';
import ActionType from '../game/ActionType.js';
import Card from '../game/Card.js';
import Player, { Skill } from '../game/Player.js';

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
