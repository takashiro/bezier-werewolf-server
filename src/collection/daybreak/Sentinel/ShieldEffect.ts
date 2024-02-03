import ActionType from '../../../game/ActionType.js';
import Event from '../../../game/Event.js';
import EventHook from '../../../game/EventHook.js';
import ActionValidation from '../../ActionValidation.js';

const forbiddenActions = [
	ActionType.ViewRole,
	ActionType.MoveRole,
];

export default class ShieldEffect extends EventHook<ActionValidation> {
	constructor() {
		super(Event.ValidatingAction);
	}

	// eslint-disable-next-line class-methods-use-this
	process(data: ActionValidation): void {
		if (!forbiddenActions.includes(data.type)) {
			return;
		}

		const { player } = data;
		if (player.isShielded()) {
			data.valid = false;
		}
	}
}
