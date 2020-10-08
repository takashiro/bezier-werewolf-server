import {
	Selection,
} from '@bezier/werewolf-core';

import Card from '../../../game/Card';
import ExchangeAction from '../../ExchangeAction';
import Skill from '../../Skill';

import IAlphaWolf from './AlphaWolf';
import CenterWerewolfCard from './CenterWerewolfCard';

export default class AlphaWolf extends Skill<void> implements IAlphaWolf {
	protected card?: Card;

	constructor() {
		super();
		this.listeners = [
			new CenterWerewolfCard(this),
		];
	}

	setCard(card: Card): void {
		this.card = card;
	}

	isFeasible(data: Selection): boolean {
		const { driver, owner } = this;
		if (!driver || !owner) {
			return false;
		}

		const target = data.players && driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== owner;
	}

	protected run(data: Selection): void {
		const { driver, owner } = this;
		if (!driver || !owner || !data.players) {
			return;
		}
		const { card } = this;
		const target = driver.getPlayer(data.players[0]);
		if (card && target) {
			const action = new ExchangeAction(owner, 21, card, target);
			driver.addAction(action);
		}
	}
}
