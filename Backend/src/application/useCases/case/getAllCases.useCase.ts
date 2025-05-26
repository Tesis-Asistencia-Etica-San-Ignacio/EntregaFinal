import { ICaseRepository } from "../../../domain";
import { CaseResponseDto } from "../..";


export class GetAllCasesUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}
  public async execute(): Promise<CaseResponseDto[]> {
    return this.caseRepository.findAll();
  }
}
