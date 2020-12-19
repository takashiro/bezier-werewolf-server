import {
	Selection,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import Skill from '../Skill';
import ExchangeAction from '../ExchangeAction';

export default class Troublemaker extends Skill<void> {
	protected priority = 0x1700;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		if (!data.players) {
			return false;
		}

		const seats = data.players;
		if (!(seats instanceof Array) || seats.length !== 2) {
			return false;
		}

		const players = seats.map((seat) => this.driver.getPlayer(seat));
		return players[0] !== players[1] && players.every((player) => player && player !== this.owner);
	}

	protected run(data: Selection): void {
		if (!data.players) {
			return;
		}

		const { driver } = this;
		const player1 = driver.getPlayer(data.players[0]);
		const player2 = driver.getPlayer(data.players[1]);
		if (player1 && player2) {
			driver.addAction(new ExchangeAction(this, player1, player2));
		}
	}
}
