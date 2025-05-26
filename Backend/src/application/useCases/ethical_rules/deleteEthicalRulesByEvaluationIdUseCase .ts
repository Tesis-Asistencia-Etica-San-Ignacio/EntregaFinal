import { IEthicalNormRepository } from "../../../domain";

export class deleteEthicalRulesByEvaluationIdUseCase {
    constructor(private readonly ethicalNormRepository: IEthicalNormRepository) { }

    public async execute(evaluationId: string): Promise<void> {
        await this.ethicalNormRepository.deleteByEvaluationId(evaluationId);
    }
}
