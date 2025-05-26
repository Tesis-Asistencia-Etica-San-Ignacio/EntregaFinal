import { Router } from 'express';
import { SmtpController } from '../controllers/smpt.controller';
import { validateRoleMiddleware } from '../middleware/jwtMiddleware';

const router = Router();
const smtpController = new SmtpController();

router.post(
    '/send-email',validateRoleMiddleware(['EVALUADOR']),
    (req, res) => smtpController.sendEmail(req, res)
);

export default router;