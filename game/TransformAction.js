
const Action = require('./Action');

class TransformAction extends Action {

	/**
	 * Create a transform action
	 * @param {Player} owner
	 * @param {number} priority
	 * @param {Player|CenterCard} target
	 * @param {Role} newRole
	 */
	constructor(owner, priority, target, newRole) {
		super(owner, priority);

		this.target = target;
		this.newRole = newRole;
	}

	/**
	 * Take effect
	 */
	execute() {
		this.target.setRole(this.newRole);
	}

}

module.exports = TransformAction;
