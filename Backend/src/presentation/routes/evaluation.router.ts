import { Router } from "express";
import { EvaluacionController } from "../controllers";

import {
  CreateEvaluacionUseCase,
  GetAllEvaluacionsUseCase,
  GetEvaluacionByIdUseCase,
  UpdateEvaluacionUseCase,
  DeleteEvaluacionUseCase,
  GetEvaluacionesByUserUseCase,
  deleteEthicalRulesByEvaluationIdUseCase,
} from "../../application";

import {
  EvaluacionRepository,
  EthicalNormRepository,
} from "../../infrastructure";

import { validateRoleMiddleware } from "../middleware/jwtMiddleware";

const router = Router();

/* ───── Repositorios ───── */
const evaluacionRepo = new EvaluacionRepository();
const ethicalNormRepo = new EthicalNormRepository();

/* ───── Use‑cases auxiliares ───── */
const deleteNormsUC = new deleteEthicalRulesByEvaluationIdUseCase(
  ethicalNormRepo,
);

/* ───── Use‑cases principales ───── */
const createEvaluacionUC = new CreateEvaluacionUseCase(evaluacionRepo);
const getAllEvaluacionsUC = new GetAllEvaluacionsUseCase(evaluacionRepo);
const getEvaluacionByIdUC = new GetEvaluacionByIdUseCase(evaluacionRepo);
const updateEvaluacionUC = new UpdateEvaluacionUseCase(evaluacionRepo);
const deleteEvaluacionUC = new DeleteEvaluacionUseCase(evaluacionRepo, deleteNormsUC);
const getEvalsByUserUC = new GetEvaluacionesByUserUseCase(evaluacionRepo);

/* ───── Controlador ───── */
const evaluacionController = new EvaluacionController(
  createEvaluacionUC,
  getAllEvaluacionsUC,
  getEvaluacionByIdUC,
  updateEvaluacionUC,
  deleteEvaluacionUC,
  getEvalsByUserUC,
);

/* ───── Rutas ───── */
router.get("/my", validateRoleMiddleware(["EVALUADOR"]), evaluacionController.getByUser,);
router.get("/:id", validateRoleMiddleware(["EVALUADOR"]), evaluacionController.getById,);
router.get("/", validateRoleMiddleware(["EVALUADOR"]), evaluacionController.getAll,);
router.post("/", validateRoleMiddleware(["EVALUADOR"]), evaluacionController.create,);
router.patch("/:id", validateRoleMiddleware(["EVALUADOR"]), evaluacionController.update,);
router.delete("/:id", validateRoleMiddleware(["EVALUADOR"]), evaluacionController.delete,);

export default router;
