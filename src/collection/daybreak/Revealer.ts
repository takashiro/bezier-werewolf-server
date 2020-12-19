import {
	Selection,
	Team,
	Teamship,
	Vision,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import RevealAction from '../RevealAction';
import VisionSkill from '../VisionSkill';

export default class Revealer extends VisionSkill {
	protected priority = 0x1a00;

	protected mode = SkillMode.ReadWrite;

	isFeasible(data: Selection): boolean {
		if (data.cards || !data.players || data.players.length !== 1) {
			return false;
		}
		const [target] = data.players;
		return Boolean(this.driver.getPlayer(target));
	}

	protected show(data: Selection): Vision {
		if (!data.players) {
			return {};
		}
		const target = this.driver.getPlayer(data.players[0]);
		if (!target) {
			return {};
		}

		const team = Teamship.get(target.getRole());
		if (team === Team.Villager) {
			this.driver.addAction(new RevealAction(this, target));
		}

		return Revealer.showPlayer(target, true);
	}
}
