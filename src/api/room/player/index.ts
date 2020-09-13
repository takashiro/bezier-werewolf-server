import { Router } from 'express';

import seatRouter from './seat';

const router = Router({
	mergeParams: true,
});

router.get('/:seat/seat', seatRouter);

export default router;
