
const Role = require('../Role');
const VisionSkill = require('../VisionSkill');

class InDream extends VisionSkill {

	constructor() {
		super(Role.DreamWolf, Role.Werewolf);
	}

}

module.exports = InDream;
