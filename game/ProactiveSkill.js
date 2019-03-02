
class ProactiveSkill {

	constructor(role) {
		this.role = role;
		this.state = 0;
		this.stateNum = 1;
		this.output = null;
	}

	/**
	 * Check if the skill has been invoked
	 * @return {boolean}
	 */
	isUsed() {
		return this.state >= this.stateNum;
	}

	/**
	 * Check if the selected targets are feasible to invoke the skill
	 * @param {Driver} driver
	 * @param {Player} self
	 * @param {*} data
	 */
	isFeasible(driver, self, data) {
		return !!driver && !!self;
	}

	/**
	 * Invoke the skill.
	 * takeEffect() will be called, skill state will be updated and its output will be recorded.
	 * @param {Driver} driver
	 * @param {Player} self
	 * @param {*} data
	 */
	invoke(driver, self, data) {
		this.nextState = this.state + 1;
		const output = this.takeEffect(driver, self, data);
		if (this.nextState !== this.state) {
			this.state = this.nextState;
			this.output = output;
		}
	}

	/**
	 * Get the output of the last invocation.
	 * @return {*}
	 */
	getOutput() {
		return this.output;
	}

	/**
	 * Take effect on targets
	 * @param {Driver} driver
	 * @param {Player} self
	 * @param {*} data
	 * @return {object|undefined} data transfered to clients
	 */
	takeEffect(driver, self, data) {
	}

	showPlayers(players) {
		players = players.map(player => ({seat: player.seat, role: player.role.toNum()}));
		return {players};
	}

	showCards(cards) {
		cards = cards.map(card => ({pos: card.pos, role: card.role.toNum()}));
		return {cards};
	}

}

module.exports = ProactiveSkill;
