import { IPromptRepository } from '../../../domain';
import { PromptResponseDto } from '../../../application';

export class GetAllpromptsUseCase {
  constructor(private readonly promptRepository: IPromptRepository) {}

  public async execute(): Promise<PromptResponseDto[]> {
    console.log('Executing GetAllpromptsUseCase...');
    return this.promptRepository.findAll();
  }
}
