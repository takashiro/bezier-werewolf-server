import Action from '../game/Action';
import Player, { Skill } from '../game/Player';
import ActionType from '../game/ActionType';

export default class DiscloseAction extends Action {
	protected from: Player;

	protected to: Player;

	/**
	 * Create an exchange action
	 * @param skill
	 * @param from
	 * @param to
	 */
	constructor(skill: Skill, from: Player, to: Player) {
		super(skill, ActionType.None);

		this.from = from;
		this.to = to;
	}

	protected run(): void {
		this.from.discloseTo(this.to);
	}
}
