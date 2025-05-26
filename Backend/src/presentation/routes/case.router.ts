import { Router } from "express";
import { CaseController } from "../controllers/case.controller";
import { CreateCaseUseCase } from "../../application/useCases/case/createCase.useCase";
import { GetAllCasesUseCase } from "../../application/useCases/case/getAllCases.useCase";
import { DeleteCaseUseCase, GetCaseByIdUseCase, UpdateCaseUseCase, GetCasesByUserIdUseCase } from "../../application/useCases/case";
import { CaseRepository } from "../../infrastructure/database/repositories/case.repository.impl";
import { validateRoleMiddleware } from "../middleware/jwtMiddleware";

const router = Router();

const caseRepository = new CaseRepository();

const createCaseUseCase = new CreateCaseUseCase(caseRepository);
const deleteCaseUseCase = new DeleteCaseUseCase(caseRepository);
const getCaseByIdUseCase = new GetCaseByIdUseCase(caseRepository);
const updateCaseUseCase = new UpdateCaseUseCase(caseRepository);
const getAllCasesUseCase = new GetAllCasesUseCase(caseRepository);
const getCasesByUserIdUseCase = new GetCasesByUserIdUseCase(caseRepository);

const caseController = new CaseController(createCaseUseCase, getAllCasesUseCase, getCaseByIdUseCase, updateCaseUseCase, deleteCaseUseCase, getCasesByUserIdUseCase);

router.post("/", validateRoleMiddleware(['INVESTIGADOR']), caseController.create);
router.get('/my', validateRoleMiddleware(['INVESTIGADOR']), caseController.getMyCases);
router.get("/:id", validateRoleMiddleware(['INVESTIGADOR']), caseController.getById);
router.patch("/:id", validateRoleMiddleware(['INVESTIGADOR']), caseController.update);
router.delete("/:id", validateRoleMiddleware(['INVESTIGADOR']), caseController.delete);

export default router;