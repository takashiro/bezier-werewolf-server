import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import TransformAction from '../TransformAction';
import VisionSkill from '../VisionSkill';

export default class Doppelganger extends VisionSkill {
	protected priority = 0x0700;

	protected mode = SkillMode.ReadWrite;

	isFeasible(data: Selection): boolean {
		if (data.cards || data.players?.length !== 1) {
			return false;
		}

		const target = this.driver.getPlayer(data.players[0]);
		return Boolean(target);
	}

	protected show(data: Selection): Vision {
		if (!data.players || data.players.length < 1) {
			return {};
		}

		const { driver } = this;
		const target = driver.getPlayer(data.players[0]);
		if (!target) {
			return {};
		}

		const { owner } = this;
		const role = target.getRole();
		owner.setNotionalRole(role);
		driver.addAction(new TransformAction(this, owner, role));
		driver.giftPlayer(owner, role);
		return Doppelganger.showPlayer(target, true);
	}
}
