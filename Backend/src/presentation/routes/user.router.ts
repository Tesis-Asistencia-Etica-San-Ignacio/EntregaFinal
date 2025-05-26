import { Router } from "express";
import { UserController } from "../../presentation";
import {
  UserRepository,
  PromptRepository,
} from "../../infrastructure/database/repositories";
import {
  CreateEvaluatorUseCase,
  CreateInvestigatorUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  UpdatePasswordUseCase,
} from "../../application";
import { validateRoleMiddleware } from "../middleware/jwtMiddleware";

const router = Router();

const userRepository = new UserRepository();
const promptRepository = new PromptRepository();

const createEvaluatorUseCase = new CreateEvaluatorUseCase(
  userRepository,
  promptRepository
);
const createInvestigatorUseCase = new CreateInvestigatorUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const updatePasswordUseCase = new UpdatePasswordUseCase(userRepository);

const userController = new UserController(
  createEvaluatorUseCase,
  createInvestigatorUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  updatePasswordUseCase,
);

router.get(
  "/",
  validateRoleMiddleware(["EVALUADOR", "INVESTIGADOR"]),
  userController.getAll
);
router.get(
  "/:id",
  validateRoleMiddleware(["EVALUADOR", "INVESTIGADOR"]),
  userController.getById
);
router.post(
  "/evaluador",
  validateRoleMiddleware(["EVALUADOR"]),
  userController.createEvaluator
);

// Registro de investigador es público
router.post("/investigador", userController.createInvestigator);

router.patch(
  "/",
  validateRoleMiddleware(["EVALUADOR", "INVESTIGADOR"]),
  userController.update
);
router.delete(
  "/",
  validateRoleMiddleware(["EVALUADOR", "INVESTIGADOR"]),
  userController.delete
);
router.post(
  "/update-password",
  validateRoleMiddleware(["EVALUADOR", "INVESTIGADOR"]),
  userController.updatePassword
);

export default router;
