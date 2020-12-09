import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';

import ApprenticeTanner from './ApprenticeTanner';
import Squire from './Squire';

const col = new Collection('bonus');

col.add(Role.ApprenticeTanner, ApprenticeTanner);
col.add(Role.Squire, Squire);

export default col;
