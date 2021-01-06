import Action from '../game/Action';

export default class SkipAction extends Action {
	protected count = 0;

	protected run(): void {
		this.count++;
	}
}
