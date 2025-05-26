import { Request, Response, NextFunction } from 'express';
import { CreatepromptUseCase, GetAllpromptsUseCase, GetpromptByIdUseCase, UpdatepromptUseCase, DeletepromptUseCase, ResetPromptsUseCase, GetPromptsByEvaluatorIdUseCase } from '../../application';

export class PromptController{
  constructor(
    private readonly createpromptUseCase: CreatepromptUseCase,
    private readonly getAllpromptsUseCase: GetAllpromptsUseCase,
    private readonly getpromptByIdUseCase: GetpromptByIdUseCase,
    private readonly updatepromptUseCase: UpdatepromptUseCase,
    private readonly deletepromptUseCase: DeletepromptUseCase,
    private readonly resetPromptsUseCase: ResetPromptsUseCase,
    private readonly getPromptsByEvaluatorIdUseCase: GetPromptsByEvaluatorIdUseCase
  ) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prompts = await this.getAllpromptsUseCase.execute();
      res.status(200).json(prompts);
      console.log(prompts);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const prompt = await this.getpromptByIdUseCase.execute(id);
      if (!prompt) {
        res.status(404).json({ message: 'prompt no encontrado' });
      } else {
        res.status(200).json(prompt);
      }
    } catch (error) {
      next(error);
    }
  };

  public getByEvaluatorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const prompts = await this.getPromptsByEvaluatorIdUseCase.execute(userId);
      res.status(200).json(prompts);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newprompt = await this.createpromptUseCase.execute(req.body);
      res.status(201).json(newprompt);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedprompt = await this.updatepromptUseCase.execute(id, req.body);
      if (!updatedprompt) {
        res.status(404).json({ message: 'prompt no encontrado' });
      } else {
        res.status(200).json(updatedprompt);
      }
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const wasDeleted = await this.deletepromptUseCase.execute(id);
      if (!wasDeleted) {
        res.status(404).json({ message: 'prompt no encontrado' });
      } else {
        res.status(200).json({ message: 'prompt eliminado correctamente' });
      }
    } catch (error) {
      next(error);
    }
  };
  
  public resetPrompts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.resetPromptsUseCase.execute(userId);
      res.status(200).json({ message: 'Prompts reinicializados correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
