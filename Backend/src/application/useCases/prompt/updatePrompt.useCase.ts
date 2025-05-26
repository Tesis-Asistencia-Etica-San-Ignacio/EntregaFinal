import { IPromptRepository } from '../../../domain';
import { UpdatepromptDto, PromptResponseDto } from '../../../application';

export class UpdatepromptUseCase {
  constructor(private readonly promptRepository: IPromptRepository) {}

  public async execute(id: string, data: UpdatepromptDto): Promise<PromptResponseDto | null> {
    return this.promptRepository.update(id, data);
  }
}
