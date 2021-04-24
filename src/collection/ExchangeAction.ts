import Action from '../game/Action';
import Player, { Skill } from '../game/Player';
import Card from '../game/Card';
import ActionType from '../game/ActionType';

export default class ExchangeAction extends Action {
	protected from: Player | Card;

	protected to: Player | Card;

	/**
	 * Create an exchange action
	 * @param skill
	 * @param from
	 * @param to
	 */
	constructor(skill: Skill, from: Player | Card, to: Player | Card) {
		super(skill, ActionType.MoveRole);

		this.from = from;
		this.to = to;
	}

	protected run(): void {
		const fromRole = this.from.getRole();
		const toRole = this.to.getRole();
		this.from.setRole(toRole);
		this.to.setRole(fromRole);
	}
}
