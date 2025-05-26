import { Request, Response } from 'express';
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
import { EvaluatePipelineUseCase } from '../../application/useCases/ia/evaluatePipeline.useCase';

export class IAController {
  private readonly pipelineUC: EvaluatePipelineUseCase;

  constructor(
    createNormsUC: CreateEthicalRulesUseCase,
    generateLLMUC: GenerateCompletionUseCase,
    getEvalByIdUC: GetEvaluacionByIdUseCase,
    getPromptsUC: GetPromptsByEvaluatorIdUseCase,
    getEvalsByUserUC: GetEvaluacionesByUserUseCase,
    updateEvalUC: UpdateEvaluacionUseCase,
    deleteNormsUC: deleteEthicalRulesByEvaluationIdUseCase,
    private readonly obtainModelsUC: ObtainModelsUseCase,
    private readonly  modifyProviderApiKeyUC: ModifyProviderApiKeyUseCase,
    private readonly getUserByIdUC: GetUserByIdUseCase

    /* updateApiKey: UpdateEvaluacionUseCase, */
  ) {
    this.pipelineUC = new EvaluatePipelineUseCase(
      getEvalByIdUC,
      getEvalsByUserUC,
      getPromptsUC,
      generateLLMUC,
      deleteNormsUC,
      createNormsUC,
      updateEvalUC,
    );
  }

  /** Primera evaluación */
  public evaluate = async (req: Request, res: Response) => {
    try {
      const evaluador = await this.getUserByIdUC.execute(req.user!.id);

      if (!evaluador) {
        res.status(404).json({ success: false, message: 'Evaluador no encontrado' });
        return;
      }

      if (!evaluador.modelo || !evaluador.provider) {
        res.status(400).json({ success: false, message: 'Evaluador sin modelo o proveedor' });
        return;
      }
  
      await this.pipelineUC.execute({
        evaluatorId: req.user!.id,
        model: evaluador.modelo,
        provider: evaluador.provider,
        evaluationId: req.body.evaluationId,
        cleanNormsBefore: false,
      });
      res.json({ success: true, message: 'Evaluación procesada con éxito' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message ?? 'Error' });
    }
  };

  /** Re-evaluación */
  public reEvaluate = async (req: Request, res: Response) => {
    try {
      const evaluador = await this.getUserByIdUC.execute(req.user!.id);

      if (!evaluador) {
        res.status(404).json({ success: false, message: 'Evaluador no encontrado' });
        return;
      }

      if (!evaluador.modelo || !evaluador.provider) {
        res.status(400).json({ success: false, message: 'Evaluador sin modelo o proveedor' });
        return;
      }

      await this.pipelineUC.execute({
        evaluatorId: req.user!.id,
        model: evaluador.modelo,
        provider: evaluador.provider,
        evaluationId: req.body.evaluationId,
        cleanNormsBefore: true,
      });
      res.json({ success: true, message: 'Re-evaluación exitosa' });
    } catch (e: any) {
      
      res.status(500).json({ success: false, error: e.message ?? 'Error' });
    }
  };

  public getModels = async (req: Request, res: Response) => {
    try {
      const models = await this.obtainModelsUC.execute();
      res.json({ success: true, models });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message ?? 'Error' });
    }
  };

  public modifyApiKey = async (req: Request, res: Response) => {
    try {
      const { provider, apiKey } = req.body;
      const result = await this.modifyProviderApiKeyUC.execute(provider as string, apiKey as string);
      res.json({ success: true, message: `API key para ${result} actualizada con éxito` });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message ?? 'Error' });
    }
  };

}
