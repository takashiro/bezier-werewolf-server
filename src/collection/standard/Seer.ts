import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import ActionType from '../../game/ActionType';
import MutexType from '../../game/MutexType';

import VisionSkill from '../VisionSkill';

export default class Seer extends VisionSkill {
	protected priority = 0x500;

	protected readMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		if (!data) {
			return true;
		}

		if (data.cards) {
			const cards = this.selectCards(data, 2);
			return cards?.length === 2;
		}

		const player = this.selectPlayer(data);
		if (!player) {
			return true;
		}

		if (player === this.owner) {
			return false;
		}

		return this.validateAction(ActionType.ViewRole, player);
	}

	protected show(data: Selection): Vision | undefined {
		if (data.cards) {
			const cards = this.selectCards(data, 2);
			return cards && this.showCards(cards);
		}
		if (data.players) {
			const player = this.selectPlayer(data);
			return player && this.showPlayer(player);
		}
	}
}
