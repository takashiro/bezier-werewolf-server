#!/usr/bin/env node

import { config } from './base/Config.js';
import { lobby } from './base/Lobby.js';

import app from './index.js';

await config.read();
lobby.setRoomExpiry(config.roomExpiry);
lobby.setCapacity(config.lobbyCapacity);
app.listen(config.socket);
