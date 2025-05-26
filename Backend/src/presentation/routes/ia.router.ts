import { Router } from 'express';
import { IAController } from '../controllers/ia.controller';
import {
  CreateEthicalRulesUseCase,
  GenerateCompletionUseCase,
  GetEvaluacionByIdUseCase,
  GetPromptsByEvaluatorIdUseCase,
  GetEvaluacionesByUserUseCase,
  UpdateEvaluacionUseCase,
  deleteEthicalRulesByEvaluationIdUseCase,
  ObtainModelsUseCase,
  ModifyProviderApiKeyUseCase,
  GetUserByIdUseCase
} from '../../application';
import {
  EthicalNormRepository,
  EvaluacionRepository,
  PromptRepository,
  UserRepository
} from '../../infrastructure';
import { validateRoleMiddleware } from '../middleware/jwtMiddleware';

const router = Router();

const userRepo = new UserRepository();
const evaluacionRepo = new EvaluacionRepository();
const ethicalRepo = new EthicalNormRepository();
const promptRepo = new PromptRepository();

const createNormsUC = new CreateEthicalRulesUseCase(ethicalRepo);
const generateLLMUC = new GenerateCompletionUseCase();
const getEvalByIdUC = new GetEvaluacionByIdUseCase(evaluacionRepo);
const getPromptsUC = new GetPromptsByEvaluatorIdUseCase(promptRepo);
const getEvalsByUserUC = new GetEvaluacionesByUserUseCase(evaluacionRepo);
const updateEvalUC = new UpdateEvaluacionUseCase(evaluacionRepo);
const deleteNormsUC = new deleteEthicalRulesByEvaluationIdUseCase(ethicalRepo);
const ObtainModelsUC = new ObtainModelsUseCase();
const modifyProviderApiKeyUC = new ModifyProviderApiKeyUseCase();
const getUserByIdUC = new GetUserByIdUseCase(userRepo); 
/* const updateApiKey = new UpdateEvaluacionUseCase(); */


const iaController = new IAController(
  createNormsUC,
  generateLLMUC,
  getEvalByIdUC,
  getPromptsUC,
  getEvalsByUserUC,
  updateEvalUC,
  deleteNormsUC,
  ObtainModelsUC,
  modifyProviderApiKeyUC,
  getUserByIdUC
);

/* Rutas */

router.post(
  '/evaluate',
  validateRoleMiddleware(['EVALUADOR']),
  iaController.evaluate,
);

router.post(
  '/re-evaluate',
  validateRoleMiddleware(['EVALUADOR']),
  iaController.reEvaluate,
);

router.get(
  '/models',
  validateRoleMiddleware(['EVALUADOR']),
  iaController.getModels,
);
router.post(
  '/config/apikey',
  validateRoleMiddleware(['EVALUADOR']),
  iaController.modifyApiKey
);

export default router;
