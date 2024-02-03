import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType.js';
import Card from '../../game/Card.js';
import Player from '../../game/Player.js';
import MutexType from '../../game/MutexType.js';

import ExchangeAction from '../ExchangeAction.js';
import SkipAction from '../SkipAction.js';
import VisionSkill from '../VisionSkill.js';

export default class Witch extends VisionSkill {
	protected priority = 0x620;

	protected readMode = [MutexType.ActualRole];

	protected writeMode = [MutexType.ActualRole];

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
			const target = this.selectPlayer(data);
			if (!target) {
				return false;
			}
			return this.validateAction(ActionType.MoveRole, target);
		}

		return true;
	}

	protected show(data: Selection): Vision | undefined {
		if (this.selectNone(data)) {
			this.driver.addAction(new SkipAction(this));
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

		return this.showPlayer(this.selectedPlayer);
	}
}
