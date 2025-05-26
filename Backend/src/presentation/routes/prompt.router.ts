import { Router } from "express";
import { PromptController } from "../../presentation";
import { PromptRepository } from "../../infrastructure/database/repositories";
import {
  CreatepromptUseCase,
  GetAllpromptsUseCase,
  GetpromptByIdUseCase,
  UpdatepromptUseCase,
  DeletepromptUseCase,
  ResetPromptsUseCase,
  GetPromptsByEvaluatorIdUseCase,
} from "../../application";
import { validateRoleMiddleware } from "../middleware/jwtMiddleware";

const router = Router();
const promptRepository = new PromptRepository();

const createpromptUseCase             = new CreatepromptUseCase(promptRepository);
const getAllpromptsUseCase            = new GetAllpromptsUseCase(promptRepository);
const getpromptByIdUseCase            = new GetpromptByIdUseCase(promptRepository);
const updatepromptUseCase             = new UpdatepromptUseCase(promptRepository);
const deletepromptUseCase             = new DeletepromptUseCase(promptRepository);
const resetPromptsUseCase             = new ResetPromptsUseCase(promptRepository);
const getPromptsByEvaluatorIdUseCase  = new GetPromptsByEvaluatorIdUseCase(promptRepository);

const promptController = new PromptController(
  createpromptUseCase,
  getAllpromptsUseCase,
  getpromptByIdUseCase,
  updatepromptUseCase,
  deletepromptUseCase,
  resetPromptsUseCase,
  getPromptsByEvaluatorIdUseCase
);

router.get(
  "/my",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.getByEvaluatorId
);
router.post(
  "/my/reset-prompts",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.resetPrompts
);
router.patch(
  "/:id",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.update
);
router.get(
  "/",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.getAll
);
router.get(
  "/:id",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.getById
);
router.post(
  "/",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.create
);
router.delete(
  "/:id",
  validateRoleMiddleware(["EVALUADOR"]),
  promptController.delete
);

export default router;
