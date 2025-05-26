import { IPromptRepository } from '../../../domain';
import { CreatepromptDto, PromptResponseDto } from '../../../application';

export class CreatepromptUseCase {
  constructor(private readonly promptRepository: IPromptRepository) {}

  public async execute(data: CreatepromptDto): Promise<PromptResponseDto> {
    const prompt = await this.promptRepository.create(data);
    return prompt;
  }
}
