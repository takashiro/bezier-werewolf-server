import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import ActionType from '../../game/ActionType.js';
import MutexType from '../../game/MutexType.js';
import VisionSkill from '../VisionSkill.js';

export default class Insomniac extends VisionSkill {
	protected priority = 0x900;

	protected readMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		if (!this.validateAction(ActionType.ViewRole, this.owner)) {
			return {};
		}
		return this.showPlayer(this.owner);
	}
}
