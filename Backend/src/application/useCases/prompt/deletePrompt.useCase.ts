import { IPromptRepository } from '../../../domain';

export class DeletepromptUseCase {
  constructor(private readonly promptRepository: IPromptRepository) {}

  public async execute(id: string): Promise<boolean> {
    return this.promptRepository.delete(id);
  }
}
