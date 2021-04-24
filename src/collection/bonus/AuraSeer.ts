import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import ActionType from '../../game/ActionType';
import MutexType from '../../game/MutexType';
import VisionSkill from '../VisionSkill';

const auraActions = [
	ActionType.MoveRole,
	ActionType.ViewRole,
];

export default class AuraSeer extends VisionSkill {
	protected priority = 0x730;

	protected readMode = [MutexType.Any];

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const history = this.driver.getHistory(this.getOrder())
			.filter((action) => auraActions.includes(action.getType()));
		const players = history.map((action) => action.getOwner());
		return {
			players: players.map((player) => ({
				seat: player.getSeat(),
				role: Role.Unknown,
			})),
		};
	}
}
