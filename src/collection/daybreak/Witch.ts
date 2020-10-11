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
	protected priority = 620;

	protected mode = SkillMode.ReadWrite;

	protected skipped = false;

	protected selectedCard?: Card;

	protected selectedPlayer?: Player;

	isFinished(): boolean {
		return this.skipped || Boolean(this.selectedCard && this.selectedPlayer);
	}

	isFeasible(data: Selection): boolean {
		const { driver } = this;

		if (!data.cards && !data.players) {
			return true;
		}

		if (this.selectedCard === undefined) {
			const card = data.cards && driver.getCenterCard(data.cards[0]);
			return Boolean(card);
		}

		if (this.selectedPlayer === undefined) {
			const target = data.players && driver.getPlayer(data.players[0]);
			return Boolean(target);
		}

		return true;
	}

	protected show(data: Selection): Vision {
		if (!data.players && !data.cards) {
			this.skipped = true;
			return {};
		}

		const { driver, owner } = this;

		if (this.selectedCard === undefined) {
			const card = data.cards && driver.getCenterCard(data.cards[0]);
			if (card) {
				this.selectedCard = card;
				return Witch.showCards([card]);
			}
			return {};
		}

		if (this.selectedPlayer === undefined) {
			const target = data.players && driver.getPlayer(data.players[0]);
			if (target) {
				this.selectedPlayer = target;
				driver.addAction(new ExchangeAction(owner, 61, this.selectedCard, target));
			}
		}

		const vision = Witch.showCards([this.selectedCard]);
		if (this.selectedPlayer) {
			const player = this.selectedPlayer.getProfile();
			player.role = this.selectedCard.getRole();
			vision.players = [player];
		}
		return vision;
	}
}
