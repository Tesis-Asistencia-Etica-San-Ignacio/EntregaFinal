import { ICaseRepository } from "../../../domain/repositories/case.repository";

export class DeleteCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  public async execute(id: string): Promise<boolean> {
    return this.caseRepository.delete(id);
  }
}