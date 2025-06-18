

import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { Upload } from 'lucide-react';
import { upload } from '../middleware/uploadMiddleware.js';
const router = Router();

router.get('/', getAbout);
router.put('/',upload.any(), updateAbout);

export default router;