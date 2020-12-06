import { Vision } from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class Insomniac extends VisionSkill {
	protected priority = 900;

	protected show(): Vision {
		return Insomniac.showPlayers([this.owner]);
	}
}
