import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import ActionType from '../game/ActionType';
import Card from '../game/Card';
import Player from '../game/Player';

import Skill from './Skill';
import ViewAction from './ViewAction';

export default abstract class VisionSkill extends Skill<Vision | undefined> {
	protected run(data: Selection): Vision | undefined {
		return this.show(data);
	}

	protected showThumbOf(player: Player): Vision {
		if (!this.validateAction(ActionType.ShowThumb, player)) {
			return {};
		}
		return {
			players: [player.getNotionalProfile()],
		};
	}

	protected showThumbsOf(players: Player[]): Vision {
		const snapshots = players.map((player) => {
			const profile = player.getNotionalProfile();
			if (!this.validateAction(ActionType.ShowThumb, player)) {
				profile.role = Role.Unknown;
			}
			return profile;
		});
		return {
			players: snapshots,
		};
	}

	protected showPlayer(player: Player): Vision {
		if (!this.validateAction(ActionType.ViewRole, player)) {
			return {};
		}

		const snapshot = player.getActualProfile();
		this.driver.addAction(new ViewAction(this, [player]));
		return {
			players: [snapshot],
		};
	}

	protected showPlayers(players: Player[]): Vision {
		const snapshots = players.map((player) => {
			const profile = player.getActualProfile();
			if (!this.validateAction(ActionType.ViewRole, player)) {
				profile.role = Role.Unknown;
			}
			return profile;
		});
		this.driver.addAction(new ViewAction(this, players));
		return {
			players: snapshots,
		};
	}

	protected showCard(card: Card): Vision {
		const cards = [card.getProfile()];
		this.driver.addAction(new ViewAction(this, [card]));
		return {
			cards,
		};
	}

	protected showCards(cards: Card[]): Vision {
		const snapshots = cards.map((card) => card.getProfile());
		this.driver.addAction(new ViewAction(this, cards));
		return {
			cards: snapshots,
		};
	}

	/**
	 * Show the vision of a player
	 * @param data
	 * @return players or cards that can be seen
	 */
	protected abstract show(data: Selection): Vision | undefined;
}
