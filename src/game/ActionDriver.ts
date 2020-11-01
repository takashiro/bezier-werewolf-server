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
		if (action.getOrder() <= this.getPhase()) {
			action.exec();
		}
	}

	protected movePhaseTo(phase: number): void {
		super.movePhaseTo(phase);
		this.exec();
	}

	/**
	 * Take all action effects.
	 */
	protected exec(): void {
		this.actions.sort((a, b) => a.getOrder() - b.getOrder());
		const phase = this.getPhase();
		for (const action of this.actions) {
			if (action.getOrder() <= phase) {
				action.exec();
			} else {
				break;
			}
		}
	}
}
