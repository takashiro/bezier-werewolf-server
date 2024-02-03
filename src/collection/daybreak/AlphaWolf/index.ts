import {
	Role,
	Selection,
} from '@bezier/werewolf-core';

import ActionType from '../../../game/ActionType.js';
import Card from '../../../game/Card.js';
import MutexType from '../../../game/MutexType.js';

import ExchangeAction from '../../ExchangeAction.js';
import Skill from '../../Skill.js';

import CenterWerewolfCard from './CenterWerewolfCard.js';

export default class AlphaWolf extends Skill<void> {
	protected priority = 0x320;

	protected writeMode = [MutexType.ActualRole];

	protected hooks = [
		new CenterWerewolfCard(this),
	];

	getCard(): Card | undefined {
		const cards = this.driver.getCenterCards();
		return cards.find((card) => card.hasFlag(Role.AlphaWolf));
	}

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target || target === this.owner) {
			return false;
		}
		return this.validateAction(ActionType.MoveRole, target);
	}

	protected run(data: Selection): void {
		if (!data.players) {
			return;
		}

		const card = this.getCard();
		const { driver } = this;
		const target = driver.getPlayer(data.players[0]);
		if (card && target) {
			const action = new ExchangeAction(this, card, target);
			driver.addAction(action);
		}
	}
}
