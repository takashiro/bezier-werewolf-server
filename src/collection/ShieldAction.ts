import Action from '../game/Action';
import ActionType from '../game/ActionType';
import Player, { Skill } from '../game/Player';

export default class ShieldAction extends Action {
	protected target: Player;

	constructor(skill: Skill, target: Player) {
		super(skill, ActionType.None);
		this.target = target;
	}

	protected run(): void {
		this.target.setShielded(true);
	}
}
