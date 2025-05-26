import { Request, Response, NextFunction } from "express";
import {
  CreateEthicalRuleUseCase,
  GetAllEthicalRulesUseCase,
  GetEthicalRulesByEvaluationUseCase,
  UpdateEthicalRuleUseCase,
  DeleteEthicalRuleUseCase,
} from "../../application";
import {
  CreateEthicalNormDto,
  UpdateEthicalNormDto,
} from "../../application/dtos";

export class EthicalNormController {
  constructor(
    private readonly createUseCase: CreateEthicalRuleUseCase,
    private readonly getAllUseCase: GetAllEthicalRulesUseCase,
    private readonly getByEvaluationUseCase: GetEthicalRulesByEvaluationUseCase,
    private readonly updateUseCase: UpdateEthicalRuleUseCase,
    private readonly deleteUseCase: DeleteEthicalRuleUseCase
  ) { }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newNorm = await this.createUseCase.execute(
        req.body as CreateEthicalNormDto
      );
      res.status(201).json(newNorm);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const norms = await this.getAllUseCase.execute();
      res.status(200).json(norms);
    } catch (error) {
      next(error);
    }
  };

  public getByEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { evaluationId } = req.params;
      const norms = await this.getByEvaluationUseCase.execute(evaluationId);
      res.status(200).json(norms);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.body);
      const { id } = req.params;
      const updatedNorm = await this.updateUseCase.execute(
        id,
        req.body as UpdateEthicalNormDto
      );
      updatedNorm
        ? res.status(200).json(updatedNorm)
        : res.status(404).json({ message: "Norma ética no encontrada" });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.deleteUseCase.execute(id);
      success
        ? res.status(200).json({ message: "Norma eliminada correctamente" })
        : res.status(404).json({ message: "Norma ética no encontrada" });
    } catch (error) {
      next(error);
    }
  };
}