import {
	Role,
	Selection,
} from '@bezier/werewolf-core';

import ActionType from '../../../game/ActionType';
import Card from '../../../game/Card';
import MutexType from '../../../game/MutexType';

import ExchangeAction from '../../ExchangeAction';
import Skill from '../../Skill';

import CenterWerewolfCard from './CenterWerewolfCard';

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
