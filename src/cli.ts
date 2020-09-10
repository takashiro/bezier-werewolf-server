#!/usr/bin/env node

import { config } from './base/Config';
import { lobby } from './base/Lobby';

import app from './index';

(async function main(): Promise<void> {
	await config.read();
	lobby.setRoomExpiry(config.roomExpiry);
	lobby.setCapacity(config.lobbyCapacity);
	app.listen(config.socket);
}());
