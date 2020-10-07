import {
	Selection,
} from '@bezier/werewolf-core';

import ProactiveSkill from '../ProactiveSkill';
import ExchangeAction from '../ExchangeAction';

export default class Troublemaker extends ProactiveSkill<void> {
	isFeasible(data: Selection): boolean {
		const { driver, owner } = this;
		if (!driver || !owner) {
			return false;
		}

		if (!data || !data.players) {
			return false;
		}

		const seats = data.players;
		if (!(seats instanceof Array) || seats.length !== 2) {
			return false;
		}

		const players = seats.map((seat) => driver.getPlayer(seat));
		return players[0] !== players[1] && players.every((player) => player && player !== owner);
	}

	protected run(data: Selection): void {
		const { driver, owner } = this;
		if (!driver || !owner || !data || !data.players) {
			return;
		}

		const player1 = driver.getPlayer(data.players[0]);
		const player2 = driver.getPlayer(data.players[1]);
		// Skill Priority: 7
		if (player1 && player2) {
			driver.addAction(new ExchangeAction(owner, 70, player1, player2));
		}
	}
}
