import { Selection } from '@bezier/werewolf-core';

import Card from '../game/Card';
import Driver from '../game/Driver';
import Player from '../game/Player';
import BaseSkill from '../game/Skill';

abstract class Skill<OutputType> extends BaseSkill<Driver, Player, Selection, OutputType> {
	selectNone(sel: Selection): boolean {
		return this.driver && !sel.cards && !sel.players;
	}

	selectCard(sel: Selection): Card | undefined {
		if (!sel) {
			return;
		}

		const { cards } = sel;
		if (!cards || cards.length !== 1) {
			return;
		}
		return this.driver.getCenterCard(cards[0]);
	}

	selectCards(sel: Selection, num: number): Card[] | undefined {
		if (!sel) {
			return;
		}

		const { cards } = sel;
		if (!cards || cards.length !== num) {
			return;
		}

		const targets: Card[] = [];
		for (const card of cards) {
			const target = this.driver.getCenterCard(card);
			if (target) {
				targets.push(target);
			} else {
				return;
			}
		}
		return targets;
	}

	selectPlayer(sel: Selection): Player | undefined {
		if (!sel) {
			return;
		}

		const { players } = sel;
		if (!players || players.length !== 1) {
			return;
		}
		return this.driver.getPlayer(players[0]);
	}

	selectPlayers(sel: Selection, num: number): Player[] | undefined {
		if (!sel) {
			return;
		}

		const { players } = sel;
		if (!players || players.length !== num) {
			return;
		}

		const targets: Player[] = [];
		for (const player of players) {
			const target = this.driver.getPlayer(player);
			if (target) {
				targets.push(target);
			} else {
				return;
			}
		}
		return targets;
	}
}

export default Skill;
