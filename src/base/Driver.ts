import { GameConfig } from '@bezier/werewolf-core';

interface Driver {
	getConfig(): GameConfig;
}

export default Driver;
