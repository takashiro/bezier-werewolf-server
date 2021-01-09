import Action from '../game/Action';
import Card from '../game/Card';
import Player, { Skill } from '../game/Player';

export default class ViewAction extends Action {
	protected targets: (Player | Card)[];

	protected readOnly = true;

	constructor(skill: Skill, targets: (Player | Card)[]) {
		super(skill);
		this.targets = targets;
		this.executed = true;
	}

	protected run(): void {
		this.executed = true;
	}
}
