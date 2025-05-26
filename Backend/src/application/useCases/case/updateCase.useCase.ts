import { ICaseRepository, Case } from "../../../domain";
import { UpdateCaseDto } from "../..";

export class UpdateCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) { }

  public async execute(
    id: string,
    data: UpdateCaseDto,
  ): Promise<Case | null> {
    const caso = await this.caseRepository.update(id, data);
    if (caso) {
      return {
        ...caso,
        createdAt: new Date(caso.createdAt),
        updatedAt: new Date(caso.updatedAt),
        fecha: new Date(caso.fecha),
      }
    }
    return null;
  }
}
