import * as fs from 'fs';

const { readFile } = fs.promises;

export default class Config {
	socket: number | string;

	roomExpiry: number;

	lobbyCapacity: number;

	constructor() {
		this.socket = '/var/run/bezier-werewolf/bezier-werewolf.sock';
		this.roomExpiry = 60 * 60 * 1000;
		this.lobbyCapacity = 1000;
	}

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
