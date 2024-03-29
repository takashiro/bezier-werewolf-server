import { Selection } from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType.js';
import MutexType from '../../game/MutexType.js';

import ShiftAction, { ShiftDirection } from '../ShiftAction.js';
import SkipAction from '../SkipAction.js';
import Skill from '../Skill.js';

function takeDirection(selected: number, self: number): ShiftDirection {
	const dist = selected - self;
	if (dist === -1 || dist > 1) {
		return ShiftDirection.Descending;
	}
	if (dist === 1 || dist < -1) {
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

		const players = this.driver.getPlayers()
			.filter((player) => player.getSeat() !== seat && this.validateAction(ActionType.MoveRole, player));
		if (players.length <= 1) {
			this.driver.addAction(new SkipAction(this));
			return;
		}

		this.driver.addAction(new ShiftAction(this, direction, players));
	}
}
