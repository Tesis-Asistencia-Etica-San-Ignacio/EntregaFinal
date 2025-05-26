import { ICaseRepository } from "../../../domain";
import { CaseResponseDto } from "../../dtos";

export class GetCaseByIdUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  public async execute(id: string): Promise<CaseResponseDto | null> {
    return this.caseRepository.findById(id);
  }
}
