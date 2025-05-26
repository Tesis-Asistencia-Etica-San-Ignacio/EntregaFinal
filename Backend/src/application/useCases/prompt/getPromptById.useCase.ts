import { IPromptRepository } from '../../../domain';
import { PromptResponseDto } from '../../../application';

export class GetpromptByIdUseCase {
  constructor(private readonly promptRepository: IPromptRepository) {}

  public async execute(id: string): Promise<PromptResponseDto | null> {
    return this.promptRepository.findById(id);
  }
}
