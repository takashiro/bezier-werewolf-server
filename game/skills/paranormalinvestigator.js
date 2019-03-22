
const Role = require('../Role');
const Team = require('../Team');
const ProactiveSkill = require('../ProactiveSkill');
const TransformAction = require('../TransformAction');

class Investigate extends ProactiveSkill {

	constructor() {
		super(Role.ParanormalInvestigator);
	}

	isFeasible(driver, self, data) {
		if (!super.isFeasible(driver, self, data)) {
			return false;
		}

		const targets = data.players;
		if (!targets || !(targets instanceof Array)) {
			return false;
		}

		if (targets.length != 2) {
			return false;
		}

		return data.players.every(seat => {
			const target = driver.getPlayer(seat);
			return target && target !== self;
		});
	}

	takeEffect(driver, self, data) {
		const targets = data.players.map(seat => driver.getPlayer(seat));
		const t0 = targets[0];
		if (t0.role.team === Team.Werewolf || t0.role.team === Team.Tanner) {
			targets.splice(1, 1);
		}

		// Action Priority: 5c
		if (targets.some(target => target.role.team === Team.Werewolf)) {
			driver.addAction(new TransformAction(self, 52, self, Role.Werewolf));
		} else if (targets.some(target => target.role.team === Team.Tanner)) {
			driver.addAction(new TransformAction(self, 52, self, Role.Tanner));
		}

		return this.showPlayers(targets);
	}

}

module.exports = Investigate;
