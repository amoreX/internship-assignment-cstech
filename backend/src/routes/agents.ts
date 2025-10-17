import { Router } from 'express';
import { getAgents, createAgent, deleteAgent } from '../controllers/agentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAgents);
router.post('/', authenticateToken, createAgent);
router.delete('/:id', authenticateToken, deleteAgent);

export default router;
