import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection.js';
import Werewolf from '../standard/Werewolf.js';

import AlphaWolf from './AlphaWolf/index.js';
import ApprenticeSeer from './ApprenticeSeer.js';
import Curator from './Curator/index.js';
import MysticWolf from './MysticWolf.js';
import ParanormalInvestigator from './ParanormalInvestigator.js';
import Revealer from './Revealer.js';
import Sentinel from './Sentinel/index.js';
import VillageIdiot from './VillageIdiot.js';
import Witch from './Witch.js';

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
