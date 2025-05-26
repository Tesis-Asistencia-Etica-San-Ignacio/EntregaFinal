import { Router } from 'express';
import multer from 'multer';
import { uploadFileController, getAllFilesController, downloadPdfController } from '../controllers/file.controller';
import { validateRoleMiddleware } from '../middleware/jwtMiddleware';


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', validateRoleMiddleware(['EVALUADOR']), upload.single('file'), uploadFileController);
router.get('/', getAllFilesController);
router.get("/pdf/:fileName", downloadPdfController);


export default router;
