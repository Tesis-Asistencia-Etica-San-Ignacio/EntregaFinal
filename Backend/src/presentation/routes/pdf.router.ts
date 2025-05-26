import { Router } from 'express';
import { PdfController } from '../controllers/pdf.controller';
import { validateRoleMiddleware } from "../middleware/jwtMiddleware";

const router = Router();
const pdfController = new PdfController();

router.post('/preview-evaluator', validateRoleMiddleware(['EVALUADOR']), (req, res) => pdfController.previewEvaluatorPdf(req, res));
router.post('/preview-investigator', validateRoleMiddleware(['INVESTIGADOR']), (req, res) => pdfController.previewInvestigatorPdf(req, res));

export default router;
