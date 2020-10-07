import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';
import Werewolf from '../standard/Werewolf';

import MysticWolf from './MysticWolf';
import ParanormalInvestigator from './ParanormalInvestigator';
import Witch from './Witch';

const col = new Collection('daybreak');
col.add(Role.MysticWolf, Werewolf, MysticWolf);
col.add(Role.ParanormalInvestigator, ParanormalInvestigator);
col.add(Role.Witch, Witch);

export default col;
