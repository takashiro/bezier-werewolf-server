import ActionType from '../game/ActionType.js';
import Player from '../game/Player.js';

interface ActionValidation {
	type: ActionType;
	player: Player;
	valid: boolean;
}

export default ActionValidation;
