import ActionType from '../../../game/ActionType';
import Event from '../../../game/Event';
import EventHook from '../../../game/EventHook';
import ActionValidation from '../../ActionValidation';

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
