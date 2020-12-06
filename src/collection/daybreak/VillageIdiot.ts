import { Selection } from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import Skill from '../Skill';

export default class VillageIdiot extends Skill<void> {
	protected priority = 720;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		if (data.cards) {
			return false;
		}

		const { players } = data;
		if (!players || players.length !== 1) {
			return false;
		}
		const [target] = players;

		const cur = this.owner.getSeat();
		const playerNum = this.driver.getPlayers().length;
		const prev = cur > 1 ? cur - 1 : playerNum;
		const next = cur < playerNum ? cur + 1 : 1;
		return target === cur || target === prev || target === next;
	}

	protected run(data: Selection): void {
		if (!data.players || data.players.length <= 0) {
			return;
		}

		const [direction] = data.players;
		const seat = this.owner.getSeat();
		const players = this.driver.getPlayers().filter((player) => player.getSeat() !== seat);
		if (players.length <= 1) {
			return;
		}

		players.sort((a, b) => a.getSeat() - b.getSeat());
		const roles = players.map((player) => player.getRole());
		if (direction < seat) {
			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				const role = roles[i + 1] || roles[0];
				player.setRole(role);
			}
		} else if (direction > seat) {
			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				const role = roles[i - 1] || roles[roles.length - 1];
				player.setRole(role);
			}
		}
	}
}
