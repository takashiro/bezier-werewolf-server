import Action from '../game/Action.js';
import ActionType from '../game/ActionType.js';
import Player, { Skill } from '../game/Player.js';

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
