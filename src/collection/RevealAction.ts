import Action from '../game/Action.js';
import ActionType from '../game/ActionType.js';
import Card from '../game/Card.js';
import Player, { Skill } from '../game/Player.js';

export default class RevealAction extends Action {
	protected target: Player | Card;

	/**
	 * Create a reveal action
	 * @param owner
	 * @param target
	 * @param newRole
	 */
	constructor(owner: Skill, target: Player | Card) {
		super(owner, ActionType.None);

		this.target = target;
	}

	protected run(): void {
		this.target.setRevealed(true);
	}
}
