import {
	Player,
	Role,
	Selection,
	Team,
	Teamship,
	Vision,
} from '@bezier/werewolf-core';
import TransformAction from '../TransformAction';
import VisionSkill from '../VisionSkill';

const transformMap = new Map<Team, Role>();
transformMap.set(Team.Werewolf, Role.Werewolf);
transformMap.set(Team.Tanner, Role.Tanner);

export default class ParanormalInvestigator extends VisionSkill {
	protected selectedTargets: number[];

	protected transformedTo?: Role;

	constructor() {
		super();
		this.selectedTargets = [];
	}

	isFinished(): boolean {
		return this.transformedTo !== undefined || this.selectedTargets.length >= 2;
	}

	isFeasible(data: Selection): boolean {
		if (this.selectedTargets.length >= 2 || this.transformedTo) {
			return false;
		}

		const { driver, owner } = this;
		if (!driver || !owner || !data.players) {
			return false;
		}

		const { players } = data;
		if (players.length !== 1) {
			return false;
		}

		const target = driver.getPlayer(players[0]);
		return Boolean(target) && target !== owner;
	}

	protected show(data: Selection): Vision {
		const { driver, owner } = this;
		const { players } = data;
		if (!driver || !owner || !players) {
			return {};
		}

		const target = driver.getPlayer(players[0]);
		if (!target) {
			return {};
		}

		if (!this.selectedTargets.includes(players[0])) {
			// Action Priority: 5c
			this.selectedTargets.push(players[0]);
			const team = Teamship.get(target.getRole());
			const role = team ? transformMap.get(team) : undefined;
			if (role) {
				this.transformedTo = role;
				driver.addAction(new TransformAction(owner, 52, owner, role));
			}
		}

		const vision: Player[] = [];
		for (const seat of this.selectedTargets) {
			const player = driver.getPlayer(seat);
			if (player) {
				vision.push(player.getProfile());
			}
		}
		if (this.transformedTo) {
			vision.push({
				seat: owner.getSeat(),
				role: this.transformedTo,
			});
		}

		return {
			players: vision,
		};
	}
}
