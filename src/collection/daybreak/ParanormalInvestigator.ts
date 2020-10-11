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
	protected priority = 530;

	protected selectedTargets: number[] = [];

	protected transformedTo?: Role;

	isFinished(): boolean {
		return this.transformedTo !== undefined || this.selectedTargets.length >= 2;
	}

	isFeasible(data: Selection): boolean {
		if (this.selectedTargets.length >= 2 || this.transformedTo) {
			return false;
		}

		if (!data.players) {
			return false;
		}

		const { players } = data;
		if (players.length !== 1) {
			return false;
		}

		const target = this.driver.getPlayer(players[0]);
		return Boolean(target) && target !== this.owner;
	}

	protected show(data: Selection): Vision {
		const { players } = data;
		if (!players) {
			return {};
		}

		const target = this.driver.getPlayer(players[0]);
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
				this.driver.addAction(new TransformAction(this.owner, 52, this.owner, role));
			}
		}

		const vision: Player[] = [];
		for (const seat of this.selectedTargets) {
			const player = this.driver.getPlayer(seat);
			if (player) {
				vision.push(player.getProfile());
			}
		}
		if (this.transformedTo) {
			vision.push({
				seat: this.owner.getSeat(),
				role: this.transformedTo,
			});
		}

		return {
			players: vision,
		};
	}
}
