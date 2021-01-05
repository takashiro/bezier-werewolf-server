import Action from '../game/Action';
import Player, { Skill } from '../game/Player';

export const enum ShiftDirection {
	None,
	Descending,
	Ascending,
}

export default class ShiftAction extends Action {
	protected direction: ShiftDirection;

	protected targets: Player[];

	constructor(skill: Skill, direction: ShiftDirection, targets: Player[]) {
		super(skill);
		this.direction = direction;
		this.targets = targets;
	}

	protected run(): void {
		const { targets: players } = this;
		if (players.length <= 1) {
			return;
		}

		players.sort((a, b) => a.getSeat() - b.getSeat());
		const roles = players.map((player) => player.getRole());
		if (this.direction === ShiftDirection.Descending) {
			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				const role = roles[i + 1] || roles[0];
				player.setRole(role);
			}
		} else if (this.direction === ShiftDirection.Ascending) {
			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				const role = roles[i - 1] || roles[roles.length - 1];
				player.setRole(role);
			}
		}
	}
}
