import Action from '../game/Action';

export default class SkipAction extends Action {
	protected run(): void {
		this.executed = true;
	}
}
