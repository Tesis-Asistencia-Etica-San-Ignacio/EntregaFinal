import { PromptResponseDto, CreatepromptDto, UpdatepromptDto } from '../../application';

export interface IPromptRepository {
  findAll(): Promise<PromptResponseDto[]>;
  findById(id: string): Promise<PromptResponseDto | null>;
  findByEvaluatorId(evaluatorId: string): Promise<PromptResponseDto[]>;
  create(data: Omit<CreatepromptDto, 'id'>): Promise<PromptResponseDto>;
  update(id: string, data: Partial<Omit<UpdatepromptDto, 'id'>>): Promise<PromptResponseDto | null>;
  delete(id: string): Promise<boolean>; 
  deleteByEvaluatorId(evaluatorId: string): Promise<boolean>;
}
