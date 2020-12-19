import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';

import Doppelganger from './Doppelganger';
import Drunk from './Drunk';
import Insomniac from './Insomniac';
import Mason from './Mason';
import Minion from './Minion';
import Robber from './Robber';
import Seer from './Seer';
import Troublemaker from './Troublemaker';
import Werewolf from './Werewolf';
import LoneWolf from './LoneWolf';

const col = new Collection('standard');
col.add(Role.Doppelganger, Doppelganger);
col.add(Role.Drunk, Drunk);
col.add(Role.Insomniac, Insomniac);
col.add(Role.Mason, Mason);
col.add(Role.Minion, Minion);
col.add(Role.Robber, Robber);
col.add(Role.Seer, Seer);
col.add(Role.Troublemaker, Troublemaker);
col.add(Role.Werewolf, Werewolf, LoneWolf);

export default col;
