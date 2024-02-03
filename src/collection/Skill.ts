import { Selection } from '@bezier/werewolf-core';
import ActionType from '../game/ActionType.js';

import Card from '../game/Card.js';
import Driver from '../game/Driver.js';
import Event from '../game/Event.js';
import Player from '../game/Player.js';
import BaseSkill from '../game/Skill.js';
import ActionValidation from './ActionValidation.js';

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

	protected validateAction(type: ActionType, player: Player): boolean {
		const data: ActionValidation = {
			type,
			player,
			valid: true,
		};
		this.driver.trigger(Event.ValidatingAction, data);
		return data.valid;
	}
}

export default Skill;
