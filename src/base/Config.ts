import * as fs from 'fs';
import { ListenOptions } from 'net';

const { readFile } = fs.promises;

export default class Config {
	socket: number | string | ListenOptions = '/var/run/bezier-werewolf/bezier-werewolf.sock';

	roomExpiry = 60 * 60 * 1000;

	lobbyCapacity = 1000;

	async read(file = 'config.json'): Promise<void> {
		if (!fs.existsSync(file)) {
			return;
		}

		try {
			const content = await readFile(file, 'utf-8');
			const config = JSON.parse(content);
			Object.assign(this, config);
		} catch (error) {
			// Ignore
		}
	}
}

export const config = new Config();
