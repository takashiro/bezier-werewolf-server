import { Selection } from '@bezier/werewolf-core';

import Driver from '../game/Driver';
import Player from '../game/Player';
import BaseProactiveSkill from '../game/Skill';

abstract class ProactiveSkill<OutputType> extends BaseProactiveSkill<Player, Driver, Selection, OutputType> {
}

export default ProactiveSkill;
