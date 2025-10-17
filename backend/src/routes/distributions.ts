import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { uploadFile, listDistributions } from '../controllers/distributionController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload',  upload.single('file'), uploadFile);
router.get('/', authenticateToken, listDistributions);

export default router;
