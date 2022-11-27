import {
	expect,
	it,
} from '@jest/globals';

import ViewAction from '../../src/collection/ViewAction';
import { Skill } from '../../src/game/Player';

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
