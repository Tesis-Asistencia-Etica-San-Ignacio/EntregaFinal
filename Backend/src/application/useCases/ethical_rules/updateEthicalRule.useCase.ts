import { IEthicalNormRepository } from "../../../domain";
import { UpdateEthicalNormDto, EthicalNormResponseDto } from "../../dtos";

export class UpdateEthicalRuleUseCase {
  constructor(private readonly repository: IEthicalNormRepository) {}

  public async execute(
    id: string,
    data: UpdateEthicalNormDto
  ): Promise<EthicalNormResponseDto | null> {

    return this.repository.update(id, data);
  }
}