import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import Player from '../../game/Player';
import MutexType from '../../game/MutexType';

import TransformAction from '../TransformAction';
import SkipAction from '../SkipAction';
import VisionSkill from '../VisionSkill';
import isWerewolf from '../isWerewolf';
import ActionType from '../../game/ActionType';

function transformTo(seen: Role): Role {
	if (isWerewolf(seen)) {
		return Role.Werewolf;
	}
	if (seen === Role.Tanner) {
		return Role.Tanner;
	}
	return Role.Unknown;
}

export default class ParanormalInvestigator extends VisionSkill {
	protected priority = 0x530;

	protected readMode = [MutexType.ActualRole];

	protected writeMode = [MutexType.ActualRole];

	protected selectedTargets: Player[] = [];

	protected transformedTo?: Role;

	isFinished(): boolean {
		return this.transformedTo !== undefined || this.selectedTargets.length >= 2;
	}

	isFeasible(data: Selection): boolean {
		if (this.selectedTargets.length >= 2 || this.transformedTo) {
			return false;
		}

		const target = this.selectPlayer(data);
		if (!target || target === this.owner) {
			return false;
		}

		return this.validateAction(ActionType.ViewRole, target);
	}

	protected show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		if (!target) {
			return;
		}

		if (!this.selectedTargets.includes(target)) {
			// Action Priority: 5c
			this.selectedTargets.push(target);
			const seen = target.getRole();
			const role = transformTo(seen);
			if (role !== Role.Unknown) {
				this.transformedTo = role;
				this.driver.addAction(new TransformAction(this, this.owner, role));
			} else if (this.selectedTargets.length >= 2) {
				this.driver.addAction(new SkipAction(this));
			}
		}

		const vision = this.showPlayers(this.selectedTargets);
		if (vision.players && this.transformedTo) {
			vision.players.push({
				seat: this.owner.getSeat(),
				role: this.transformedTo,
			});
		}
		return vision;
	}
}
