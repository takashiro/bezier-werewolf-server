import Action from './Action.js';
import EventDriver from './EventDriver.js';

import insert, { asc } from '../util/insert.js';

function actionAsc(a: Action, b: Action): number {
	return a.getOrder() - b.getOrder();
}

export default class ActionDriver extends EventDriver {
	protected phase = Number.NEGATIVE_INFINITY;

	protected phases: number[] = [];

	protected actions: Action[] = [];

	protected history: Action[] = [];

	/**
	 * @param now order of the current skill. Posterior skills are excluded.
	 * @return All executed actions.
	 */
	getHistory(now: number): Action[] {
		const history: Action[] = [];
		for (const action of this.history) {
			if (action.getOrder() >= now) {
				break;
			}
			history.push(action);
		}
		return history;
	}

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
		if (action.isExecuted()) {
			// Executed actions go to the history immediately.
			insert(this.history, action, actionAsc);
			return true;
		}

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

	isPending(): boolean {
		if (this.phases.length > this.actions.length) {
			return true;
		}
		return this.actions.some((action) => !action.isExecuted());
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

			if (action.exec()) {
				insert(this.history, action, actionAsc);
			}
		}
	}
}
