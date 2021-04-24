import ActionType from '../game/ActionType';
import Player from '../game/Player';

interface ActionValidation {
	type: ActionType;
	player: Player;
	valid: boolean;
}

export default ActionValidation;
