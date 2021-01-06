import Action from './Action';
import EventDriver from './EventDriver';

import insert, { asc } from '../util/insert';

function actionAsc(a: Action, b: Action): number {
	return a.getOrder() - b.getOrder();
}

export default class ActionDriver extends EventDriver {
	protected phase = Number.NEGATIVE_INFINITY;

	protected phases: number[] = [];

	protected actions: Action[] = [];

	/**
	 * @return Current phase
	 */
	getPhase(): number {
		return this.phase;
	}

	/**
	 * Add a phase.
	 * The driver will go through all phases in ascending order and execute corresponding actions.
	 * @param phase
	 * @return Whether the phase is added. A night phase cannot be added if it has passed.
	 */
	addPhase(phase: number): boolean {
		if (phase <= this.phase) {
			// Passed phases cannot be added anymore.
			return false;
		}
		insert(this.phases, phase, asc);
		return true;
	}

	/**
	 * Add an action
	 * @param action
	 * @return Whether the action is added. An action won't be added if its night phase has passed.
	 */
	addAction(action: Action): boolean {
		const order = action.getOrder();
		if (!this.phases.includes(order)) {
			// Unregistered phase
			return false;
		}
		if (this.actions.find((a) => a.getOrder() === action.getOrder())) {
			// Duplicate action in the same phase
			return false;
		}
		insert(this.actions, action, actionAsc);
		this.exec();
		return true;
	}

	/**
	 * Execute all ready actions.
	 */
	exec(): void {
		for (let i = 0; i < this.phases.length; i++) {
			const phase = this.phases[i];
			const action = this.actions[i];
			if (!action || action.getOrder() !== phase) {
				if (i > 0) {
					this.phase = this.phases[i - 1];
				}
				break;
			}
			action.exec();
		}
	}
}
