import { Selection } from '@bezier/werewolf-core';

import MutexType from '../../game/MutexType';
import ShiftAction, { ShiftDirection } from '../ShiftAction';
import SkipAction from '../SkipAction';
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

	protected writeMode = [MutexType.ActualRole];

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
			this.driver.addAction(new SkipAction(this));
			return;
		}

		const players = this.driver.getPlayers().filter((player) => player.getSeat() !== seat);
		if (players.length <= 1) {
			this.driver.addAction(new SkipAction(this));
			return;
		}

		this.driver.addAction(new ShiftAction(this, direction, players));
	}
}
