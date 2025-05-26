import { IEthicalNormRepository } from "../../../domain";
import { EthicalNormResponseDto } from "../../dtos";

export class GetEthicalRulesByEvaluationUseCase {
  constructor(private readonly repository: IEthicalNormRepository) { }

  public async execute(evaluationId: string): Promise<EthicalNormResponseDto[]> {
    const all = await this.repository.findByEvaluationId(evaluationId);
    return all.sort((a, b) => a.codeNumber.localeCompare(b.codeNumber));
  }
}