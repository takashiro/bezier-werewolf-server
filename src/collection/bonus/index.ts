import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';

import ApprenticeTanner from './ApprenticeTanner';
import AuraSeer from './AuraSeer';
import Beholder from './Beholder';
import Squire from './Squire';
import Thing from './Thing';

const col = new Collection('bonus');

col.add(Role.ApprenticeTanner, ApprenticeTanner);
col.add(Role.AuraSeer, AuraSeer);
col.add(Role.Beholder, Beholder);
col.add(Role.Squire, Squire);
col.add(Role.Thing, Thing);

export default col;
