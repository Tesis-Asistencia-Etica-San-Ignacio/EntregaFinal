import { Router } from "express";
import { EthicalNormController } from "../controllers";
import { EthicalNormRepository } from "../../infrastructure/database/repositories";
import {
  CreateEthicalRuleUseCase,
  GetAllEthicalRulesUseCase,
  GetEthicalRulesByEvaluationUseCase,
  UpdateEthicalRuleUseCase,
  DeleteEthicalRuleUseCase,
} from "../../application/";
import { validateRoleMiddleware } from "../middleware/jwtMiddleware";

const router = Router();
const repository = new EthicalNormRepository();

// Inicializar casos de uso
const createUseCase = new CreateEthicalRuleUseCase(repository);
const getAllUseCase = new GetAllEthicalRulesUseCase(repository);
const getByEvaluationUseCase = new GetEthicalRulesByEvaluationUseCase(repository);
const updateUseCase = new UpdateEthicalRuleUseCase(repository);
const deleteUseCase = new DeleteEthicalRuleUseCase(repository);

// Inicializar controlador
const controller = new EthicalNormController(
  createUseCase,
  getAllUseCase,
  getByEvaluationUseCase,
  updateUseCase,
  deleteUseCase
);

// Configurar rutas
router.post("/", validateRoleMiddleware(['EVALUADOR']), controller.create);
router.get("/", validateRoleMiddleware(['EVALUADOR']), controller.getAll);
router.get(
  "/evaluation/:evaluationId",
  validateRoleMiddleware(['EVALUADOR']),
  controller.getByEvaluation
);
router.patch("/:id", validateRoleMiddleware(['EVALUADOR']), controller.update);
router.delete("/:id", validateRoleMiddleware(['EVALUADOR']), controller.delete);

export default router;