import Action from '../game/Action';
import Driver from '../game/Driver';
import Player from '../game/Player';
import Card from '../game/Card';

export default class ExchangeAction extends Action<Driver> {
	protected from: Player | Card;

	protected to: Player | Card;

	/**
	 * Create an exchange action
	 * @param {Role} owner
	 * @param {number} priority
	 * @param {Player|CenterCard} from
	 * @param {Player|CenterCard} to
	 */
	constructor(owner: Player, priority: number, from: Player | Card, to: Player | Card) {
		super(owner, priority);

		this.from = from;
		this.to = to;
	}

	/**
	 * Take effect
	 */
	exec(): void {
		const fromRole = this.from.getRole();
		const toRole = this.to.getRole();
		this.from.setRole(toRole);
		this.to.setRole(fromRole);
	}
}
