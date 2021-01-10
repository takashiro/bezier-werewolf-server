import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import Card from '../../game/Card';
import Player from '../../game/Player';
import SkillMode from '../../game/SkillMode';

import ExchangeAction from '../ExchangeAction';
import VisionSkill from '../VisionSkill';

export default class Witch extends VisionSkill {
	protected priority = 0x620;

	protected mode = SkillMode.ReadWrite;

	protected skipped = false;

	protected selectedCard?: Card;

	protected selectedPlayer?: Player;

	isFinished(): boolean {
		return this.skipped || Boolean(this.selectedCard && this.selectedPlayer);
	}

	isFeasible(data: Selection): boolean {
		if (this.selectNone(data)) {
			return true;
		}

		if (this.selectedCard === undefined) {
			return Boolean(this.selectCard(data));
		}

		if (this.selectedPlayer === undefined) {
			return Boolean(this.selectPlayer(data));
		}

		return true;
	}

	protected show(data: Selection): Vision | undefined {
		if (this.selectNone(data)) {
			this.skipped = true;
			return;
		}

		const { driver } = this;

		if (this.selectedCard === undefined) {
			const card = this.selectCard(data);
			if (card) {
				this.selectedCard = card;
				return this.showCard(card);
			}
			return {};
		}

		if (this.selectedPlayer === undefined) {
			const target = this.selectPlayer(data);
			if (target) {
				this.selectedPlayer = target;
				driver.addAction(new ExchangeAction(this, this.selectedCard, target));
			}
		}

		if (!this.selectedPlayer) {
			return this.showCard(this.selectedCard);
		}

		return this.showPlayer(this.selectedPlayer, true);
	}
}
