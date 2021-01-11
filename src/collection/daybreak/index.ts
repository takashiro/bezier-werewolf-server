import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';
import Werewolf from '../standard/Werewolf';

import AlphaWolf from './AlphaWolf';
import ApprenticeSeer from './ApprenticeSeer';
import Curator from './Curator';
import MysticWolf from './MysticWolf';
import ParanormalInvestigator from './ParanormalInvestigator';
import Revealer from './Revealer';
import Sentinel from './Sentinel';
import VillageIdiot from './VillageIdiot';
import Witch from './Witch';

const col = new Collection('daybreak');
col.add(Role.AlphaWolf, Werewolf, AlphaWolf);
col.add(Role.ApprenticeSeer, ApprenticeSeer);
col.add(Role.Curator, Curator);
col.add(Role.MysticWolf, Werewolf, MysticWolf);
col.add(Role.ParanormalInvestigator, ParanormalInvestigator);
col.add(Role.Revealer, Revealer);
col.add(Role.Sentinel, Sentinel);
col.add(Role.VillageIdiot, VillageIdiot);
col.add(Role.Witch, Witch);

export default col;
