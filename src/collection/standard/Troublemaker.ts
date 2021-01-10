import {
	Selection,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import Skill from '../Skill';
import ExchangeAction from '../ExchangeAction';

export default class Troublemaker extends Skill<void> {
	protected priority = 0x700;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		const players = this.selectPlayers(data, 2);
		if (players?.length !== 2) {
			return false;
		}
		return players[0] !== players[1] && players.every((player) => player !== this.owner);
	}

	protected run(data: Selection): void {
		const players = this.selectPlayers(data, 2);
		if (players?.length === 2) {
			this.driver.addAction(new ExchangeAction(this, players[0], players[1]));
		}
	}
}
