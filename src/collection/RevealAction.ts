import Action from '../game/Action';
import ActionType from '../game/ActionType';
import Card from '../game/Card';
import Player, { Skill } from '../game/Player';

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
