import {
	expect,
	it,
} from '@jest/globals';

import ViewAction from '../../src/collection/ViewAction.js';
import { Skill } from '../../src/game/Player.js';

const skill = {} as unknown as Skill;
const action = new ViewAction(skill, []);

it('should be already executed', () => {
	expect(action.isExecuted()).toBe(true);
});

it('does nothing on execution', () => {
	Reflect.set(action, 'executed', false);
	expect(action.isExecuted()).toBe(false);
	expect(action.exec()).toBe(true);
	expect(action.isExecuted()).toBe(true);
});
