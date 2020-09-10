import { Router } from 'express';
import { lobby } from '../core/Lobby';

const router = Router();

router.get('/', (req, res) => {
	const status = lobby.getStatus();
	res.json(status);
});

export default router;
