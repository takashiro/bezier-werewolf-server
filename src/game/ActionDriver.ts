import Action from './Action';
import SkillDriver from './SkillDriver';

export default class ActionDriver extends SkillDriver {
	protected actions: Action[] = [];

	/**
	 * Add an action
	 * @param action
	 */
	addAction(action: Action): void {
		this.actions.push(action);
	}
}
