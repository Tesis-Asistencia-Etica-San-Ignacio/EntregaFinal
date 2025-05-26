import { ICaseRepository, Case } from '../../../domain';
import { CreateCaseDto } from '../../dtos';

export class CreateCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  public async execute(data: CreateCaseDto): Promise<Case> {
    const caso = await this.caseRepository.create(data);
    return {
      ...caso,
      createdAt: new Date(caso.createdAt),
      updatedAt: new Date(caso.updatedAt),
      fecha: new Date(caso.fecha),
    }
  }
}