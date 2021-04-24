import { Artifact } from '@bezier/werewolf-core';
import Action from '../../../game/Action';
import ActionType from '../../../game/ActionType';
import Player, { Skill } from '../../../game/Player';

const artifacts: Artifact[] = [
	Artifact.VoidOfNothingness,
	Artifact.ShroudOfShame,
	Artifact.MaskOfMuting,
	Artifact.ClawOfTheWerewolf,
	Artifact.BrandOfTheVillager,
	Artifact.CudgelOfTheTanner,
	Artifact.BowOfTheHunter,
	Artifact.SwordOfTheBodyguard,
	Artifact.CloakOfThePrince,
];

export default class RandomArtifactAction extends Action {
	protected target: Player;

	constructor(skill: Skill, target: Player) {
		super(skill, ActionType.None);
		this.target = target;
	}

	protected run(): void {
		const artifact = artifacts[Math.floor(Math.random() * artifacts.length)];
		this.target.addArtifact(artifact);
	}
}
