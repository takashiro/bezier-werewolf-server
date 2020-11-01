import {
	Selection,
} from '@bezier/werewolf-core';

import Card from '../../../game/Card';
import SkillMode from '../../../game/SkillMode';

import ExchangeAction from '../../ExchangeAction';
import Skill from '../../Skill';

import IAlphaWolf from './AlphaWolf';
import CenterWerewolfCard from './CenterWerewolfCard';

export default class AlphaWolf extends Skill<void> implements IAlphaWolf {
	protected priority = 320;

	protected mode = SkillMode.Write;

	protected card?: Card;

	protected hooks = [
		new CenterWerewolfCard(this),
	];

	setCard(card: Card): void {
		this.card = card;
	}

	isFeasible(data: Selection): boolean {
		const target = data.players && this.driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== this.owner;
	}

	protected run(data: Selection): void {
		if (!data.players) {
			return;
		}

		const { driver, card } = this;
		const target = driver.getPlayer(data.players[0]);
		if (card && target) {
			const action = new ExchangeAction(this, card, target);
			driver.addAction(action);
		}
	}
}
