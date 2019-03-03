
const Timing = require('./Timing');
const PassiveSkill = require('./PassiveSkill');

class VisionSkill extends PassiveSkill {

	/**
	 * role should be seen by viewer
	 * @param {Role} myRole
	 * @param {Role} viewerRole
	 */
	constructor(myRole, viewerRole) {
		super(Timing.Vision, myRole);
		this.viewerRole = viewerRole;
	}

	takeEffect(driver, self, data) {
		if (data.viewerRole === this.viewerRole) {
			data.players.push(self);
		}
	}

}

module.exports = VisionSkill;
