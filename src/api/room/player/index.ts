import { Router } from 'express';

import seatRouter from './seat';
import lynchRouter from './lynch';

const router = Router({
	mergeParams: true,
});

router.get('/:seat/seat', seatRouter);
router.get('/:seat/lynch', lynchRouter);

export default router;
