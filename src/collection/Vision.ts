import { Vision as BasicVision } from '@bezier/werewolf-core';

import Player from '../game/Player';

interface Vision extends BasicVision {
	viewer: Player;
}

export default Vision;
