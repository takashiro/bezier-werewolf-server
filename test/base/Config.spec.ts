import {
	expect,
	it,
	jest,
} from '@jest/globals';

import fs from 'fs';
import path from 'path';

import Config from '../../src/base/Config.js';

const config = new Config();

it('has default values', async () => {
	expect(config.socket).toBe('/var/run/bezier-werewolf/bezier-werewolf.sock');
	expect(config.roomExpiry).toBe(3600000);
	expect(config.lobbyCapacity).toBe(1000);
});

it('ignores non-existing file', async () => {
	const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
	await config.read();
	expect(existsSync).toBeCalledWith('config.json');
	existsSync.mockRestore();
});

it('reads a local config.json', async () => {
	await config.read(path.join('test', 'base', 'config.json'));
	expect(config.socket).toStrictEqual({ port: 2620 });
	expect(config.roomExpiry).toBe(36);
	expect(config.lobbyCapacity).toBe(10);
});
