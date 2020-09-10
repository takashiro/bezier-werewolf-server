import { GameConfig } from '@bezier/werewolf-core';

interface Driver {
	exec(): void;
	getConfig(): GameConfig;
}

export default Driver;
