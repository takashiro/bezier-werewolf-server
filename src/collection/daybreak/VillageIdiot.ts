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
	protected priority = 0x1720;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		if (data.cards) {
			return false;
		}

		const { players } = data;
		if (!players || players.length !== 1) {
			return false;
		}
		const [target] = players;

		const cur = this.owner.getSeat();
		const playerNum = this.driver.getPlayers().length;
		const prev = cur > 1 ? cur - 1 : playerNum;
		const next = cur < playerNum ? cur + 1 : 1;
		return target === cur || target === prev || target === next;
	}

	protected run(data: Selection): void {
		if (!data.players || data.players.length <= 0) {
			return;
		}

		const [selected] = data.players;
		const seat = this.owner.getSeat();
		const direction = takeDirection(selected, seat);
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
