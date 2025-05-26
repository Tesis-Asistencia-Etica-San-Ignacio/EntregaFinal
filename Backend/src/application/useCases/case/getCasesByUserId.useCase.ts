import { ICaseRepository } from '../../../domain';
import { CaseResponseDto } from '../../dtos/case.dto';

export class GetCasesByUserIdUseCase {
  constructor(private readonly caseRepository: ICaseRepository) { }

  public async execute(userId: string): Promise<CaseResponseDto[]> {
    return this.caseRepository.findByUserId(userId);
  }
}
