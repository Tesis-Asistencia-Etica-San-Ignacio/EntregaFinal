import type { IPromptRepository } from '../../../domain/repositories/prompt.repository';
import { PromptResponseDto } from '../../../application';


export class GetPromptsByEvaluatorIdUseCase {
  constructor(private readonly promptRepository: IPromptRepository) { }
  public async execute(evaluatorId: string): Promise<PromptResponseDto[]> {
    return this.promptRepository.findByEvaluatorId(evaluatorId);
  }
}
