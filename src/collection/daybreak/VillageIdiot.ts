import { Selection } from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import ShiftAction, { ShiftDirection } from '../ShiftAction';
import Skill from '../Skill';

function takeDirection(selected: number, self: number): ShiftDirection {
	if (selected < self) {
		return ShiftDirection.Descending;
	}
	if (selected > self) {
		return ShiftDirection.Ascending;
	}
	return ShiftDirection.None;
}

export default class VillageIdiot extends Skill<void> {
	protected priority = 0x720;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target) {
			return false;
		}
		return this.driver.getDistance(target, this.owner) <= 1;
	}

	protected run(data: Selection): void {
		const selected = this.selectPlayer(data);
		if (!selected) {
			return;
		}

		const seat = this.owner.getSeat();
		const direction = takeDirection(selected.getSeat(), seat);
		if (direction === ShiftDirection.None) {
			return;
		}

		const players = this.driver.getPlayers().filter((player) => player.getSeat() !== seat);
		if (players.length <= 1) {
			return;
		}

		this.driver.addAction(new ShiftAction(this, direction, players));
	}
}
