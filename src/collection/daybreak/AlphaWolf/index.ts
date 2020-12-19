import {
	Role,
	Selection,
} from '@bezier/werewolf-core';

import Card from '../../../game/Card';
import SkillMode from '../../../game/SkillMode';

import ExchangeAction from '../../ExchangeAction';
import Skill from '../../Skill';

import CenterWerewolfCard from './CenterWerewolfCard';

export default class AlphaWolf extends Skill<void> {
	protected priority = 0x1320;

	protected mode = SkillMode.Write;

	protected hooks = [
		new CenterWerewolfCard(this),
	];

	getCard(): Card | undefined {
		const cards = this.driver.getCenterCards();
		return cards.find((card) => card.hasFlag(Role.AlphaWolf));
	}

	isFeasible(data: Selection): boolean {
		const target = data.players && this.driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== this.owner;
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
