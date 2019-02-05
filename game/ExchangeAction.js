
const Action = require('./Action');

class ExchangeAction extends Action {

	/**
	 * Create an exchange action
	 * @param {Role} role
	 * @param {number} priority
	 * @param {Player|CenterCard} from
	 * @param {Player|CenterCard} to
	 */
	constructor(role, priority, from, to) {
		super(role, priority);

		this.from = from;
		this.to = to;
	}

	/**
	 * Take effect
	 */
	execute() {
		const fromRole = this.from.getRole();
		const toRole = this.to.getRole();
		this.from.setRole(toRole);
		this.to.setRole(fromRole);
	}

}

module.exports = ExchangeAction;
