import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import MutexType from '../../game/MutexType';
import VisionSkill from '../VisionSkill';

export default class AuraSeer extends VisionSkill {
	protected priority = 0x730;

	protected readMode = [MutexType.Any];

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const history = this.driver.getHistory(this.getOrder());
		const players = history.map((action) => action.getOwner());
		return {
			players: players.map((player) => ({
				seat: player.getSeat(),
				role: Role.Unknown,
			})),
		};
	}
}
