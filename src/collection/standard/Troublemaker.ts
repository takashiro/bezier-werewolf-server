import {
	Selection,
} from '@bezier/werewolf-core';

import MutexType from '../../game/MutexType.js';
import Skill from '../Skill.js';
import ExchangeAction from '../ExchangeAction.js';
import ActionType from '../../game/ActionType.js';

export default class Troublemaker extends Skill<void> {
	protected priority = 0x700;

	protected writeMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		const players = this.selectPlayers(data, 2);
		if (players?.length !== 2) {
			return false;
		}
		if (players[0] === players[1]) {
			return false;
		}
		for (const player of players) {
			if (player === this.owner || !this.validateAction(ActionType.MoveRole, player)) {
				return false;
			}
		}
		return true;
	}

	protected run(data: Selection): void {
		const players = this.selectPlayers(data, 2);
		if (players?.length === 2) {
			this.driver.addAction(new ExchangeAction(this, players[0], players[1]));
		}
	}
}
